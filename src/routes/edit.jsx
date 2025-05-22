import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { getContact, updateContact } from '../contacts';

export async function loader({ params }) {
	return await getContact(params.contactId);
}

export async function action({ request, params }) {
	const formData = await request.formData();
	const updates = Object.fromEntries(formData);
	await updateContact(params.contactId, updates);
	return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
	const contact = useLoaderData();
	const navigate = useNavigate();

	return (
		<Form method='post' id='contact-form'>
			<p>
				<span>Имя</span>
				<input
					placeholder='Имя'
					type='text'
					name='first'
					defaultValue={contact.first}
				/>
				<input
					placeholder='Фамилия'
					type='text'
					name='last'
					defaultValue={contact.last}
				/>
			</p>
			<label>
				<span>Ник в Твиттере</span>
				<input
					type='text'
					name='twitter'
					placeholder='@me'
					defaultValue={contact.twitter}
				/>
			</label>
			<label>
				<span>Заметка</span>
				<textarea name='notes' defaultValue={contact.notes} rows={6} />
			</label>
			<p>
				<button type='submit'>Сохранить</button>
				<button
					type='button'
					onClick={() => {
						navigate(-1);
					}}>
					Отмена
				</button>
			</p>
		</Form>
	);
}
