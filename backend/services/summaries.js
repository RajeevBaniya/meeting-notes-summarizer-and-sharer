import { supabase } from './supabase.js'

export async function saveSummary({ userId, transcript, summary, instruction, title, emailRecipients, isShared }) {
	const { data, error } = await supabase
		.from('summaries')
		.insert([{
			user_id: userId,
			transcript,
			summary,
			instruction,
			title: title || null,
			email_recipients: emailRecipients || null,
			is_shared: Boolean(isShared) || false,
			created_at: new Date(),
			updated_at: new Date()
		}])
		.select()
	
	if (error) throw error
	return data[0]
}

export async function listSummaries(userId, { skip = 0, take = 20 } = {}) {
	const { data, error } = await supabase
		.from('summaries')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.range(skip, skip + take - 1)
	
	if (error) throw error
	return data
}

export async function getSummaryById(id, userId) {
	const { data, error } = await supabase
		.from('summaries')
		.select('*')
		.eq('id', id)
		.eq('user_id', userId)
		.single()
	
	if (error && error.code !== 'PGRST116') throw error
	return data
}

export async function deleteSummary(id, userId) {
	const { error } = await supabase
		.from('summaries')
		.delete()
		.eq('id', id)
		.eq('user_id', userId)
	
	if (error) throw error
	return true
}

export async function updateSummary(id, userId, data) {

	const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
		const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
		acc[snakeKey] = value
		return acc
	}, {})
	
	formattedData.updated_at = new Date()
	
	const { data: updatedData, error } = await supabase
		.from('summaries')
		.update(formattedData)
		.eq('id', id)
		.eq('user_id', userId)
		.select()
	
	if (error) throw error
	return updatedData[0]
}


