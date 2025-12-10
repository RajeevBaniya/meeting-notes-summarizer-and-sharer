import { useState } from 'react'
import api from '../lib/api'
import { Button } from './ui/button'

function EmailSender({ summary }) {
  const [recipients, setRecipients] = useState([''])
  const [subject, setSubject] = useState('Meeting Summary')
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const addRecipient = () => {
    setRecipients([...recipients, ''])
  }

  const removeRecipient = (index) => {
    const newRecipients = recipients.filter((_, i) => i !== index)
    setRecipients(newRecipients.length > 0 ? newRecipients : [''])
  }

  const updateRecipient = (index, value) => {
    setRecipients(recipients.map((r, i) => (i === index ? value : r)))
  }

  const sendEmail = async () => {
    const validRecipients = recipients.filter(email => email.trim())
    
    if (validRecipients.length === 0) {
      setError('Please add at least one email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = validRecipients.filter(email => !emailRegex.test(email))
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email addresses: ${invalidEmails.join(', ')}`)
      return
    }

    setIsSending(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/api/email/send', {
        recipients: validRecipients,
        summary: summary,
        subject: subject
      })
      setSuccess(`Summary sent successfully to ${validRecipients.length} recipient(s)`)
    } catch (error) {
      setError('Failed to send email: ' + error.response?.data?.error || error.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="card">
      <h2 className="section-title mb-4">Share Summary via Email</h2>
      
      <div className="space-y-4 flex flex-col items-center">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Meeting Summary"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipients
          </label>
          {recipients.map((recipient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                value={recipient}
                onChange={(e) => updateRecipient(index, e.target.value)}
                placeholder="Enter email address"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {recipients.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeRecipient(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={addRecipient}
          >
            + Add another recipient
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <Button
          onClick={sendEmail}
          disabled={isSending}
          className="w-auto px-12"
          size="default"
        >
          {isSending ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending Email...
            </div>
          ) : (
            'Send Summary'
          )}
        </Button>
      </div>
    </div>
  )
}

export default EmailSender
