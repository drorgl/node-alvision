#include "Arrays.h"


namespace arrays_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("arrays_general_callback is empty");
		}
		return overload->execute("arrays", info);
	}
}

Nan::Persistent<FunctionTemplate> Arrays::constructor;

std::string Arrays::name;

void
Arrays::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	name = "Arrays";
	arrays_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(arrays_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New(name).ToLocalChecked());

	overload->register_type<Arrays>(ctor, "arrays", name);

//
//
///** @brief Wrapper for OpenGL Client-Side Vertex arrays.
//
//	ogl::Arrays stores vertex data in ogl::Buffer objects.
//	*/
//	interface Arrays
//	{
//		//public:
//		//    /** @brief Default constructor
//		//     */
//		//    Arrays();
//		//
//		//    /** @brief Sets an array of vertex coordinates.
//		//    @param vertex array with vertex coordinates, can be both host and device memory.
//		//    */
//		//    void setVertexArray(InputArray vertex);
//		//
//		//    /** @brief Resets vertex coordinates.
//		//    */
//		//    void resetVertexArray();
//		//
//		//    /** @brief Sets an array of vertex colors.
//		//    @param color array with vertex colors, can be both host and device memory.
//		//     */
//		//    void setColorArray(InputArray color);
//		//
//		//    /** @brief Resets vertex colors.
//		//    */
//		//    void resetColorArray();
//		//
//		//    /** @brief Sets an array of vertex normals.
//		//    @param normal array with vertex normals, can be both host and device memory.
//		//     */
//		//    void setNormalArray(InputArray normal);
//		//
//		//    /** @brief Resets vertex normals.
//		//    */
//		//    void resetNormalArray();
//		//
//		//    /** @brief Sets an array of vertex texture coordinates.
//		//    @param texCoord array with vertex texture coordinates, can be both host and device memory.
//		//     */
//		//    void setTexCoordArray(InputArray texCoord);
//		//
//		//    /** @brief Resets vertex texture coordinates.
//		//    */
//		//    void resetTexCoordArray();
//		//
//		//    /** @brief Releases all inner buffers.
//		//    */
//		//    void release();
//		//
//		//    /** @brief Sets auto release mode all inner buffers.
//		//    @param flag Auto release mode.
//		//     */
//		//    void setAutoRelease(bool flag);
//		//
//		//    /** @brief Binds all vertex arrays.
//		//    */
//		//    void bind() const;
//		//
//		//    /** @brief Returns the vertex count.
//		//    */
//		//    int size() const;
//		//    bool empty() const;
//		//
//		//private:
//		//    int size_;
//		//    Buffer vertex_;
//		//    Buffer color_;
//		//    Buffer normal_;
//		//    Buffer texCoord_;
//	};
}



v8::Local<v8::Function> Arrays::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}