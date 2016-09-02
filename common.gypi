{
	
	'target_defaults': {
		#enable exceptions for all targets
		'conditions':[
			['1==1',{
				'msvs_settings': {
					'VCCLCompilerTool': {
						'WarningLevel': 0,
						'WholeProgramOptimization': 'false',
						'AdditionalOptions': ['/EHsc'],
						'ExceptionHandling' : 1, #/EHsc
					}
				},
			}]
		],
	}

}