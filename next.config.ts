import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: false,
	output: "standalone",
	// Desactivar Turbopack para usar webpack con SVGR
	turbopack: {},
	webpack(config) {
		// Buscar y eliminar la regla existente de SVG si hay conflicto
		/*const fileLoaderRule = config.module.rules.find(
			(rule: any) => rule.test && rule.test.test && rule.test.test('.svg')
		);*/
		// Buscar y excluir la regla existente de SVG si hay conflicto
		const fileLoaderRule = config.module.rules.find((rule: unknown) => {
			const currentRule = rule as { test?: RegExp; exclude?: RegExp };
			return currentRule.test instanceof RegExp && currentRule.test.test(".svg");
		}) as { test?: RegExp; exclude?: RegExp } | undefined;

		if (fileLoaderRule) {
			fileLoaderRule.exclude = /\.svg$/i;
		}

		// Configurar SVGR para importar SVGs como componentes React
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: { not: /\.css$/ },
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						typescript: true,
						ext: 'tsx',
						svgoConfig: {
							plugins: [
								{
									name: 'preset-default',
									params: {
										overrides: {
											removeViewBox: false,
										},
									},
								},
							],
						},
					},
				},
			],
		});

		return config;
	},
};

export default nextConfig;
