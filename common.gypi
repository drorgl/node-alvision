{
	
	'target_defaults' : {
		 # enable exceptions for all targets
		'conditions' : [
			['1==1', {
					'msvs_settings' : {
						'VCCLCompilerTool' : {
							'WarningLevel' : 0,
							'WholeProgramOptimization' : 'false',
							'AdditionalOptions' : ['/EHsc','/bigobj'],
							'ExceptionHandling' : 1,
							 #  / EHsc
						}
					},
					'defines!' : [
						'_HAS_EXCEPTIONS=0',
						'_HAS_EXCEPTIONS',
					]
					
				}
			],
			
			['OS in "win"',{
				'defines' : [
					'DELAYIMP_INSECURE_WRITABLE_HOOKS'
				]
			}],
			
			['OS in "linux freebsd openbsd solaris android aix"', {
					'cflags_cc!' : ['-fno-rtti', '-fno-exceptions']
			}],
			['OS=="mac"', {
					'xcode_settings' : {
						'GCC_ENABLE_CPP_EXCEPTIONS' : 'YES',
						 # -fno - exceptions
					}
					
			}]
		],
	}
	
}