#include "stdafx.h"

#include "stacktrace.h"

/*
__android_log_print(ANDROID_LOG_ERROR, "TRACKERS", "%s", Str);
and add the following library

#include <android/log.h>

*/

#ifdef _WIN32
#include <Windows.h>
#include <DbgHelp.h>
#endif

#ifdef ANDROID
#include "CallStack.h"
//#include <stacktrace.h>
//#include <unwind.h>
#endif

#ifdef __LINUX__
#include <exeinfo.h>
#endif


#ifdef _WIN32
void __cdecl stacktrace::getstacktrace(std::string &buffer)
{
	unsigned int   i;
	void         * stack[100];
	unsigned short frames;
	SYMBOL_INFO  * symbol;
	HANDLE         process;

	process = GetCurrentProcess();

	SymInitialize( process, NULL, TRUE );

	frames               = CaptureStackBackTrace( 0, 100, stack, NULL );
	symbol               = ( SYMBOL_INFO * )calloc( sizeof( SYMBOL_INFO ) + 256 * sizeof( char ), 1 );
	symbol->MaxNameLen   = 255;
	symbol->SizeOfStruct = sizeof( SYMBOL_INFO );

	for( i = 0; i < frames; i++ )
	{
		SymFromAddr( process, ( DWORD64 )( stack[ i ] ), 0, symbol );

		char tmp[1024];
		_snprintf_s(tmp, sizeof (tmp), "%i: %s - 0x%0X\n", frames - i - 1, symbol->Name, symbol->Address);

		buffer.append(tmp);
		buffer.append("\r\n");
		//buffer.append()
		//printf( "%i: %s - 0x%0X\n", frames - i - 1, symbol->Name, symbol->Address );
	}

	free( symbol );
}
#endif

#ifdef ANDROID




void stacktrace::getstacktrace(string &buffer)
{
	android::CallStack stack; 
	stack.update(0,10);
	auto str = stack.toString("");
	buffer.append(str);
}

#endif

#ifdef __LINUX__

void stacktrace::getstacktrace(string &buffer)
{
	void * array[50];
	int size = backtrace(array, 50);

	char ** messages = backtrace_symbols(array, size);    

	// skip first stack frame (points here)
	for (int i = 1; i < size && messages != NULL; ++i)
	{
		char *mangled_name = 0, *offset_begin = 0, *offset_end = 0;

		// find parantheses and +address offset surrounding mangled name
		for (char *p = messages[i]; *p; ++p)
		{
			if (*p == '(')
			{
				mangled_name = p;
			}
			else if (*p == '+')
			{
				offset_begin = p;
			}
			else if (*p == ')')
			{
				offset_end = p;
				break;
			}
		}

		// if the line could be processed, attempt to demangle the symbol
		if (mangled_name && offset_begin && offset_end &&
			mangled_name < offset_begin)
		{
			*mangled_name++ = '\0';
			*offset_begin++ = '\0';
			*offset_end++ = '\0';

			int status;
			char * real_name = abi::__cxa_demangle(mangled_name, 0, 0, &status);

			// if demangling is successful, output the demangled function name
			if (status == 0)
			{
				stringstream_t ss;
				ss << "[bt]: (" << i << ") " << messages[i] << " : "
					<< real_name << "+" << offset_begin << offset_end
					<< std::endl;
				buffer.append(ss);
			}
			// otherwise, output the mangled function name
			else
			{
				stringstream_t ss;
				ss << "[bt]: (" << i << ") " << messages[i] << " : "
					<< mangled_name << "+" << offset_begin << offset_end
					<< std::endl;
				buffer.append(ss);
			}
			free(real_name);
		}
		// otherwise, print the whole line
		else
		{
			stringstream_t ss;
			ss << "[bt]: (" << i << ") " << messages[i] << std::endl;
			buffer.append(ss);
		}
	}

	buffer.append(std::endl);

	free(messages);
}

#endif

