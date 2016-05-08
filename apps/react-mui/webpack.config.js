module.exports = {
	entry: './apps/react-mui/main.js',
	output: {
		path: './apps/react-mui/',
		filename: 'bundle.js'
	},
	devServer: {
		inline: true,
		port: 3737,
		contentBase: './apps/react-mui/'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	}
}
