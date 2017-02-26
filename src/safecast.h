#ifndef _SAFE_CAST_H_
#define _SAFE_CAST_H_

#include <limits>
#include <stdexcept>

/* ranks */
/*
template<typename> struct int_rank;
#define RANK(T, I) template<> struct int_rank<T> \
{ static int const value = I; }

RANK(char, 1); RANK(unsigned char, 1); RANK(signed char, 1);
RANK(short, 2); RANK(unsigned short, 2);
RANK(int, 3); RANK(unsigned int, 3);
RANK(long, 4); RANK(unsigned long, 4);
RANK(long long, 5); RANK(unsigned long long, 5);
#undef RANK
*/
/* usual arith. conversions for ints (pre-condition: A, B differ) */
/*
template<int> struct uac_at;
template<> struct uac_at<1> { typedef int type; };
template<> struct uac_at<2> { typedef unsigned int type; };
template<> struct uac_at<3> { typedef long type; };
template<> struct uac_at<4> { typedef unsigned long type; };
template<> struct uac_at<5> { typedef long long type; };
template<> struct uac_at<6> { typedef unsigned long long type; };

template<typename A, typename B>
struct uac_type {
	static char(&f(int))[1];
	static char(&f(unsigned int))[2];
	static char(&f(long))[3];
	static char(&f(unsigned long))[4];
	typedef typename uac_at<sizeof f(0 ? A() : B())>::type type;
};
*/
/* signed games */

/*
template<typename> struct is_signed { static bool const value = false; };
#define SG(X, TT) template<> struct is_signed<X> { \
	static bool const value = true;                \
	static X const v_min = TT##_MIN;               \
	static X const v_max = TT##_MAX;               \
}

SG(signed char, SCHAR);
SG(short, SHRT);
SG(int, INT);
SG(long, LONG);
#undef SG

template<> struct is_signed<char> {
	static bool const value = (CHAR_MIN < 0);
	static char const v_min = CHAR_MIN; // just in case it's signed...
	static char const v_max = CHAR_MAX;
};
//The conversion templates make use of them, to figure out for each case when what needs to be done or not done.

template<typename To, typename From,
bool to_signed = is_signed<To>::value,
bool from_signed = is_signed<From>::value,
bool rank_fine = (int_rank<To>::value >= int_rank<From>::value)>
struct do_conv;
*/
/* these conversions never overflow, like int -> int,
* or  int -> long. */

/*
template<typename To, typename From, bool Sign>
struct do_conv<To, From, Sign, Sign, true> {
	static To call(From f) {
		return (To)f;
	}
};

template<typename To, typename From>
struct do_conv<To, From, false, false, false> {
	static To call(From f) {
		assert(f <= (To)-1);
		return (To)f;
	}
};
*/

//template<typename To, typename From>
//struct do_conv<To, From, false, true, true> {
//	typedef typename uac_type<To, From>::type type;
//	static To call(From f) {
//		/* no need to check whether To's positive range will
//		* store From's positive range: Because the rank is
//		* fine, and To is unsigned.
//		* Fixes GCC warning "comparison is always true" */
//		assert(f >= 0);
//		return (To)f;
//	}
//};
/*
template<typename To, typename From>
struct do_conv<To, From, false, true, false> {
	typedef typename uac_type<To, From>::type type;
	static To call(From f) {
		assert(f >= 0 && (type)f <= (type)(To)-1);
		return (To)f;
	}
};

template<typename To, typename From, bool Rank>
struct do_conv<To, From, true, false, Rank> {
	typedef typename uac_type<To, From>::type type;
	static To call(From f) {
		assert((type)f <= (type)is_signed<To>::v_max);
		return (To)f;
	}
};

template<typename To, typename From>
struct do_conv<To, From, true, true, false> {
	static To call(From f) {
		assert(f >= is_signed<To>::v_min && f <= is_signed<To>::v_max);
		return (To)f;
	}
};
*/
/*
template<typename To, typename From>
To safe_cast(From f) { return do_conv<To, From>::call(f); }
*/


template< typename To, typename From >  To safe_cast(const From& source)
{
	if ((source > std::numeric_limits<To>::max()) ||
		(source < std::numeric_limits<To>::min()))
	{
		throw std::overflow_error("safe cast");
	}

	return static_cast<To>(source);
}

#endif