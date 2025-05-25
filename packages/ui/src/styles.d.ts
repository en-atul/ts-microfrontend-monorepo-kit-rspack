declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export = classes;
}

declare module '*.scss' {
	const content: string;
	export default content;
}
