import { supabase } from './supabase.js'

export async function ensureUserExists(userId) {
	if (!userId) {
		throw new Error('Invalid user id')
	}
	
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single()
	
	if (error && error.code !== 'PGRST116') {
		console.error('Error checking user:', error)
	}
	
	return {
		id: userId,
		email: data?.email || null,
		name: data?.name || null
	}
}


