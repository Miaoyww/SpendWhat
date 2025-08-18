import { SETUP_VERSION } from '$lib'
import { redirect } from '@sveltejs/kit'


export async function load () {
  // redirect(307, Number(localStorage.getItem('setup-finished')) >= SETUP_VERSION ? '/app/home/' : '/setup')
}
