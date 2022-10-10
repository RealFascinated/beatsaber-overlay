import { Component } from 'react'

import '../styles/main.module.css'

export default class Home extends Component {

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		if (params.id) {
			document.location.href = "/overlay/"+ window.location.search
		}
	}

	render() {
		return <div className={main}>
			hi
		</div>
	}
}