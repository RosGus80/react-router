import { useEffect } from 'react';
import {
	Form,
	NavLink,
	Outlet,
	redirect,
	useLoaderData,
	useNavigation,
	useSubmit,
} from 'react-router-dom';

import { createContact, getContacts } from '../contacts';

export async function loader({ request }) {
	const url = new URL(request.url);
	const q = url.searchParams.get('q');
	const contacts = await getContacts(q);
	return { contacts, q };
}

export async function action() {
	const contact = await createContact();
	return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
	const { contacts, q } = useLoaderData();
	const navigation = useNavigation();
	const submit = useSubmit();

	useEffect(() => {
		document.getElementById('q').value = q;
	}, [q]);

	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has('q');

	return (
		<>
			<div id='sidebar'>
				<div>
					<Form id='search-form' role='search'>
						<input
							id='q'
							className={searching ? 'loading' : ''}
							placeholder='Поиск'
							type='search'
							name='q'
							defaultValue={q}
							onChange={(e) => {
								const isFirstSearch = q == null;
								submit(e.currentTarget.form, {
									replace: !isFirstSearch,
								});
							}}
						/>
						<div id='search-spinner' hidden={!searching} />
						<div className='sr-only'></div>
					</Form>
					<Form method='post'>
						<button type='submit'>Новый контакт</button>
					</Form>
				</div>
				<nav>
					{contacts.length ? (
						<ul>
							{contacts.map((contact) => (
								<li key={contact.id}>
									<NavLink
										to={`contacts/${contact.id}`}
										className={({ isActive, isPending }) =>
											isActive ? 'active' : isPending ? 'pending' : ''
										}>
										{contact.first || contact.last ? (
											<>
												{contact.first} {contact.last}
											</>
										) : (
											<i></i>
										)}{' '}
										{contact.favorite && <span>★</span>}
									</NavLink>
								</li>
							))}
						</ul>
					) : (<></>)}
				</nav>
			</div>
			<div
				id='detail'
				className={navigation.state === 'loading' ? 'loading' : ''}>
				<Outlet />
			</div>
		</>
	);
}
