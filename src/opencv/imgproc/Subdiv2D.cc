#include "Subdiv2D.h"
#include "../types/Rect.h"
#include "../types/Point.h"

namespace subdiv2d_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("subdiv2d_general_callback is empty");
		}
		return overload->execute("subdiv2d", info);
	}
}

Nan::Persistent<FunctionTemplate> Subdiv2D::constructor;

std::string Subdiv2D::name;

void
Subdiv2D::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	subdiv2d_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(subdiv2d_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Subdiv2D").ToLocalChecked());

	overload->register_type<Subdiv2D>(ctor, "subdiv2d", "Subdiv2D");


	auto Subdiv2DPTLOC = CreateNamedObject(target, "Subdiv2DPTLOC");
	SetObjectProperty(Subdiv2DPTLOC, "PTLOC_ERROR", -2);
	SetObjectProperty(Subdiv2DPTLOC, "PTLOC_OUTSIDE_RECT", -1);
	SetObjectProperty(Subdiv2DPTLOC, "PTLOC_INSIDE", 0);
	SetObjectProperty(Subdiv2DPTLOC, "PTLOC_VERTEX", 1);
	SetObjectProperty(Subdiv2DPTLOC, "PTLOC_ON_EDGE", 2);


	auto Subdiv2DEdgeType = CreateNamedObject(target, "Subdiv2DEdgeType");
	SetObjectProperty(Subdiv2DEdgeType, "NEXT_AROUND_ORG", 0x00);
	SetObjectProperty(Subdiv2DEdgeType, "NEXT_AROUND_DST", 0x22);
	SetObjectProperty(Subdiv2DEdgeType, "PREV_AROUND_ORG", 0x11);
	SetObjectProperty(Subdiv2DEdgeType, "PREV_AROUND_DST", 0x33);
	SetObjectProperty(Subdiv2DEdgeType, "NEXT_AROUND_LEFT", 0x13);
	SetObjectProperty(Subdiv2DEdgeType, "NEXT_AROUND_RIGHT", 0x31);
	SetObjectProperty(Subdiv2DEdgeType, "PREV_AROUND_LEFT", 0x20);
	SetObjectProperty(Subdiv2DEdgeType, "PREV_AROUND_RIGHT", 0x02);

//
////! @addtogroup imgproc_subdiv2d
//    //! @{
//
//    interface Subdiv2DStatic {
//        /** creates an empty Subdiv2D object.
//        To create a new empty Delaunay subdivision you need to use the initDelaunay() function.
//         */
//        new (): Subdiv2D;
	overload->addOverloadConstructor("subdiv2d", "Subdiv2D", {}, New);
//        //CV_WRAP Subdiv2D();
//
//        /** @overload
// 
//        @param rect – Rectangle that includes all of the 2D points that are to be added to the subdivision.
// 
//        The function creates an empty Delaunay subdivision where 2D points can be added using the function
//        insert() . All of the points to be added must be within the specified rectangle, otherwise a runtime
//        error is raised.
//         */
//        new (rect: _types.Rect): Subdiv2D;
	overload->addOverloadConstructor("subdiv2d", "Subdiv2D", {
		make_param<Rect*>("rect",Rect::name)
	}, New_rect);
//        //CV_WRAP Subdiv2D(rec : _types.Rectt);
//
//    }
//
//    interface Subdiv2D
//    {
//        /** @brief Creates a new empty Delaunay subdivision
//    
//        @param rect – Rectangle that includes all of the 2D points that are to be added to the subdivision.
//    
//         */
//        initDelaunay(rect: _types.Rect): void;
	overload->addOverload("subdiv2d", "Subdiv2D", "initDelaunay", { make_param<Rect*>("rect",Rect::name) }, initDelaunay);
//
//        /** @brief Insert a single point into a Delaunay triangulation.
//    
//        @param pt – Point to insert.
//    
//        The function inserts a single point into a subdivision and modifies the subdivision topology
//        appropriately. If a point with the same coordinates exists already, no new point is added.
//        @returns the ID of the point.
//    
//        @note If the point is outside of the triangulation specified rect a runtime error is raised.
//         */
//        insert(pt : _types.Point2f) : _st.int;
	overload->addOverload("subdiv2d", "Subdiv2D", "insert", {make_param<Point2f*>("pt",Point2f::name)}, insert);
//
//        /** @brief Insert multiple points into a Delaunay triangulation.
//    
//        @param ptvec – Points to insert.
//    
//        The function inserts a vector of points into a subdivision and modifies the subdivision topology
//        appropriately.
//         */
//        insert(ptvec : Array<_types.Point2f>) : void;
	overload->addOverload("subdiv2d", "Subdiv2D", "insert", {make_param<std::shared_ptr<std::vector<Point2f*>>>("ptvec","Array<Point2f>")}, insert_array);
//
//        /** @brief Returns the location of a point within a Delaunay triangulation.
//    
//        @param pt – Point to locate.
//        @param edge – Output edge that the point belongs to or is located to the right of it.
//        @param vertex – Optional output vertex the input point coincides with.
//    
//        The function locates the input point within the subdivision and gives one of the triangle edges
//        or vertices.
//    
//        @returns an integer which specify one of the following five cases for point location:
//        -  The point falls into some facet. The function returns PTLOC_INSIDE and edge will contain one of
//           edges of the facet.
//        -  The point falls onto the edge. The function returns PTLOC_ON_EDGE and edge will contain this edge.
//        -  The point coincides with one of the subdivision vertices. The function returns PTLOC_VERTEX and
//           vertex will contain a pointer to the vertex.
//        -  The point is outside the subdivision reference rectangle. The function returns PTLOC_OUTSIDE_RECT
//           and no pointers are filled.
//        -  One of input arguments is invalid. A runtime error is raised or, if silent or “parent” error
//           processing mode is selected, CV_PTLOC_ERROR is returnd.
//         */
//        locate(pt: _types.Point2f ,cb : (edge : _st.int, vertex : _st.int) => void) : _st.int;
	overload->addOverload("subdiv2d", "Subdiv2D", "locate", {
		make_param<Point2f*>("pt",Point2f::name) ,
		make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (edge : _st.int, vertex : _st.int) = > void
	},locate );
//
//        /** @brief Finds the subdivision vertex closest to the given point.
//    
//        @param pt – Input point.
//        @param nearestPt – Output subdivision vertex point.
//    
//        The function is another function that locates the input point within the subdivision. It finds the
//        subdivision vertex that is the closest to the input point. It is not necessarily one of vertices
//        of the facet containing the input point, though the facet (located using locate() ) is used as a
//        starting point.
//    
//        @returns vertex ID.
//         */
//        findNearest(pt: _types.Point2f, cb : (nearestPt : _types.Point2f) => void) : _st.int;
	overload->addOverload("subdiv2d", "Subdiv2D", "findNearest", {
		make_param<Point2f*>("pt",Point2f::name),
		make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (nearestPt : _types.Point2f) = > void
	}, findNearest);
//
//        /** @brief Returns a list of all edges.
//    
//        @param edgeList – Output vector.
//    
//        The function gives each edge as a 4 numbers vector, where each two are one of the edge
//        vertices. i.e. org_x = v[0], org_y = v[1], dst_x = v[2], dst_y = v[3].
//         */
//        getEdgeList(cb: (edgeList : Array<_matx.Vec4f>) => void) : void;
	overload->addOverload("subdiv2d", "Subdiv2D", "getEdgeList", {
		make_param<std::shared_ptr<or::Callback>>("cb","Function") //(edgeList : Array<_matx.Vec4f>) => void
	}, getEdgeList);
//
//        /** @brief Returns a list of all triangles.
//    
//        @param triangleList – Output vector.
//    
//        The function gives each triangle as a 6 numbers vector, where each two are one of the triangle
//        vertices. i.e. p1_x = v[0], p1_y = v[1], p2_x = v[2], p2_y = v[3], p3_x = v[4], p3_y = v[5].
//         */
//        getTriangleList(cb : (triangleList : _matx.Vec6f) => void) : void;
	overload->addOverload("subdiv2d", "Subdiv2D", "getTriangleList", {
		make_param<std::shared_ptr< or ::Callback>>("cb","Function") //(triangleList : _matx.Vec6f) => void
	}, getTriangleList);
//
//        /** @brief Returns a list of all Voroni facets.
//    
//        @param idx – Vector of vertices IDs to consider. For all vertices you can pass empty vector.
//        @param facetList – Output vector of the Voroni facets.
//        @param facetCenters – Output vector of the Voroni facets center points.
//    
//         */
//        getVoronoiFacetList(idx: Array<_st.int>, cb: (facetList: Array<_types.Point2f>, facetCenters: Array<_types.Point2f>) => void): void;
	overload->addOverload("subdiv2d", "Subdiv2D", "getVoronoiFacetList", {
		make_param<std::shared_ptr<std::vector<int>>>("idx","Array<int>"),
		make_param<std::shared_ptr< or ::Callback>>("cb","Function") //(facetList: Array<_types.Point2f>, facetCenters: Array<_types.Point2f>) => void
	}, getVoronoiFacetList);
//
//        /** @brief Returns vertex location from vertex ID.
//    
//        @param vertex – vertex ID.
//        @param firstEdge – Optional. The first edge ID which is connected to the vertex.
//        @returns vertex (x,y)
//    
//         */
//        getVertex(vertex: _st.int, cb: (firstEdge: _st.int,vertex :  _types.Point2f) => void) : void;
	overload->addOverload("subdiv2d", "Subdiv2D", "getVertex", {
		make_param<int>("vertex","int"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (firstEdge : _st.int,vertex : _types.Point2f) = > void
	}, getVertex);
//
//        /** @brief Returns one of the edges related to the given edge.
//    
//        @param edge – Subdivision edge ID.
//        @param nextEdgeType - Parameter specifying which of the related edges to return.
//        The following values are possible:
//        -   NEXT_AROUND_ORG next around the edge origin ( eOnext on the picture below if e is the input edge)
//        -   NEXT_AROUND_DST next around the edge vertex ( eDnext )
//        -   PREV_AROUND_ORG previous around the edge origin (reversed eRnext )
//        -   PREV_AROUND_DST previous around the edge destination (reversed eLnext )
//        -   NEXT_AROUND_LEFT next around the left facet ( eLnext )
//        -   NEXT_AROUND_RIGHT next around the right facet ( eRnext )
//        -   PREV_AROUND_LEFT previous around the left facet (reversed eOnext )
//        -   PREV_AROUND_RIGHT previous around the right facet (reversed eDnext )
//    
//        ![sample output](pics/quadedge.png)
//    
//        @returns edge ID related to the input edge.
//         */
//        getEdge(edge: _st.int, nextEdgeType: _st.int  ) : _st.int;
	overload->addOverload("subdiv2d", "Subdiv2D", "getEdge", {
		make_param<int>("edge","int"),
		make_param<int>("nextEdgeType","int")
	}, getEdge);
//
//        /** @brief Returns next edge around the edge origin.
//    
//        @param edge – Subdivision edge ID.
//    
//        @returns an integer which is next edge ID around the edge origin: eOnext on the
//        picture above if e is the input edge).
//         */
//        nextEdge(edge : _st.int) : _st.int;
	overload->addOverload("subdiv2d", "Subdiv2D", "nextEdge", {
		make_param<int>("edge","int")
	}, nextEdge);
//
//        /** @brief Returns another edge of the same quad-edge.
//    
//        @param edge – Subdivision edge ID.
//        @param rotate - Parameter specifying which of the edges of the same quad-edge as the input
//        one to return. The following values are possible:
//        -   0 - the input edge ( e on the picture below if e is the input edge)
//        -   1 - the rotated edge ( eRot )
//        -   2 - the reversed edge (reversed e (in green))
//        -   3 - the reversed rotated edge (reversed eRot (in green))
//    
//        @returns one of the edges ID of the same quad-edge as the input edge.
//         */
//        rotateEdge(edge : _st.int, rotate : _st.int) : _st.int;
	overload->addOverload("subdiv2d", "Subdiv2D", "rotateEdge", {
		make_param<int>("edge","int"),
		make_param<int>("rotate","int")
	}, rotateEdge);


//        symEdge(edge : _st.int) : _st.int
	overload->addOverload("subdiv2d", "Subdiv2D", "symEdge", {make_param<int>("edge","int")}, symEdge);
//
//        /** @brief Returns the edge origin.
//    
//        @param edge – Subdivision edge ID.
//        @param orgpt – Output vertex location.
//    
//        @returns vertex ID.
//         */
//        edgeOrg(edge: _st.int, cb: (orgpt: _types.Point2f, vertexId: _st.int) => void): void;
	overload->addOverload("subdiv2d", "Subdiv2D", "edgeOrg", {
		make_param<int>("edge","int"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (orgpt : _types.Point2f, vertexId : _st.int) = > void
	}, edgeOrg);
//
//        /** @brief Returns the edge destination.
//    
//        @param edge – Subdivision edge ID.
//        @param dstpt – Output vertex location.
//    
//        @returns vertex ID.
//         */
//        edgeDst(edge: _st.int, cb: (dstpt: _types.Point2f, vertexId: _st.int)=>void) : void;
	overload->addOverload("subdiv2d", "Subdiv2D", "edgeDst", {
		make_param<int>("edge","int"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (dstpt : _types.Point2f, vertexId : _st.int) = >void
	}, edgeDst);
//
//        //protected:
//        //int newEdge();
//        //void deleteEdge(edge : _st.int);
//        //int newPoint(Point2f pt, bool isvirtual, int firstEdge = 0);
//        //void deletePoint(int vtx);
//        //void setEdgePoints(edge : _st.int, int orgPt, int dstPt );
//        //void splice(edge : _st.intA, edge : _st.intB );
//        //int connectEdges(edge : _st.intA, edge : _st.intB );
//        //void swapEdges(edge : _st.int );
//        //int isRightOf(Point2f pt, edge : _st.int) const;
//        //void calcVoronoi();
//        //void clearVoronoi();
//        //void checkSubdiv() const;
//
//
//        //! All of the vertices
//        vtx: Array<Vertex>;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("vtx").ToLocalChecked(), vtx_getter, vtx_setter);
//        //std::vector < Vertex > vtx;
//        //! All of the edges
//        qedges: Array<QuadEdge>;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("qedges").ToLocalChecked(), qedges_getter, qedges_setter);
//        //std::vector < QuadEdge > qedges;
//        freeQEdge : _st.int;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("freeQEdge").ToLocalChecked(), freeQEdge_getter, freeQEdge_setter);
//        freePoint : _st.int;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("freePoint").ToLocalChecked(), freePoint_getter, freePoint_setter);
//        validGeometry : boolean;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("validGeometry").ToLocalChecked(), validGeometry_getter, validGeometry_setter);
//
//        recentEdge : _st.int;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("recentEdge").ToLocalChecked(), recentEdge_getter, recentEdge_setter);
//        //! Top left corner of the bounding rect
//        topLeft : _types.Point2f;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("topLeft").ToLocalChecked(), topLeft_getter, topLeft_setter);
//        //! Bottom right corner of the bounding rect
//        bottomRight : _types.Point2f;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("bottomRight").ToLocalChecked(), bottomRight_getter, bottomRight_setter);
//    };

target->Set(Nan::New("Subdiv2D").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> Subdiv2D::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


 POLY_METHOD(Subdiv2D::New){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::New_rect){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::initDelaunay){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::insert){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::insert_array){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::locate){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::findNearest){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::getEdgeList){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::getTriangleList){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::getVoronoiFacetList){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::getVertex){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::getEdge){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::nextEdge){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::rotateEdge){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::symEdge){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::edgeOrg){throw std::exception("not implemented");}
 POLY_METHOD(Subdiv2D::edgeDst){throw std::exception("not implemented");}


 NAN_GETTER(Subdiv2D::vtx_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::vtx_setter){throw std::exception("not implemented");}
 NAN_GETTER(Subdiv2D::qedges_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::qedges_setter){throw std::exception("not implemented");}
 NAN_GETTER(Subdiv2D::freeQEdge_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::freeQEdge_setter){throw std::exception("not implemented");}
 NAN_GETTER(Subdiv2D::freePoint_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::freePoint_setter){throw std::exception("not implemented");}
 NAN_GETTER(Subdiv2D::validGeometry_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::validGeometry_setter){throw std::exception("not implemented");}
 NAN_GETTER(Subdiv2D::recentEdge_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::recentEdge_setter){throw std::exception("not implemented");}
 NAN_GETTER(Subdiv2D::topLeft_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::topLeft_setter){throw std::exception("not implemented");}
 NAN_GETTER(Subdiv2D::bottomRight_getter){throw std::exception("not implemented");}
 NAN_SETTER(Subdiv2D::bottomRight_setter){throw std::exception("not implemented");}

