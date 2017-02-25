#ifndef _ALVISION_SUBDIV2D_H_
#define _ALVISION_SUBDIV2D_H_

#include "../../alvision.h"

class Subdiv2D : public overres::ObjectWrap{
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	std::shared_ptr<cv::Subdiv2D> _subdiv2d;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(New_rect);
	static POLY_METHOD(initDelaunay);
	static POLY_METHOD(insert);
	static POLY_METHOD(insert_array);
	static POLY_METHOD(locate);
	static POLY_METHOD(findNearest);
	static POLY_METHOD(getEdgeList);
	static POLY_METHOD(getTriangleList);
	static POLY_METHOD(getVoronoiFacetList);
	static POLY_METHOD(getVertex);
	static POLY_METHOD(getEdge);
	static POLY_METHOD(nextEdge);
	static POLY_METHOD(rotateEdge);
	static POLY_METHOD(symEdge);
	static POLY_METHOD(edgeOrg);
	static POLY_METHOD(edgeDst);


	static NAN_GETTER(vtx_getter);
	static NAN_SETTER(vtx_setter);
	static NAN_GETTER(qedges_getter);
	static NAN_SETTER(qedges_setter);
	static NAN_GETTER(freeQEdge_getter);
	static NAN_SETTER(freeQEdge_setter);
	static NAN_GETTER(freePoint_getter);
	static NAN_SETTER(freePoint_setter);
	static NAN_GETTER(validGeometry_getter);
	static NAN_SETTER(validGeometry_setter);
	static NAN_GETTER(recentEdge_getter);
	static NAN_SETTER(recentEdge_setter);
	static NAN_GETTER(topLeft_getter);
	static NAN_SETTER(topLeft_setter);
	static NAN_GETTER(bottomRight_getter);
	static NAN_SETTER(bottomRight_setter);


};

#endif





//
//    
///** Subdiv2D point location cases */
//    export enum Subdiv2DPTLOC {
//        PTLOC_ERROR = -2, //!< Point location error
//        PTLOC_OUTSIDE_RECT = -1, //!< Point outside the subdivision bounding rect
//        PTLOC_INSIDE = 0, //!< Point inside some facet
//        PTLOC_VERTEX = 1, //!< Point coincides with one of the subdivision vertices
//        PTLOC_ON_EDGE = 2  //!< Point on some edge
//    }
//
//    /** Subdiv2D edge type navigation (see: getEdge()) */
//    export enum Subdiv2DEdgeType { NEXT_AROUND_ORG = 0x00,
//        NEXT_AROUND_DST = 0x22,
//        PREV_AROUND_ORG = 0x11,
//        PREV_AROUND_DST = 0x33,
//        NEXT_AROUND_LEFT = 0x13,
//        NEXT_AROUND_RIGHT = 0x31,
//        PREV_AROUND_LEFT = 0x20,
//        PREV_AROUND_RIGHT = 0x02
//    };
//
////! @addtogroup imgproc_subdiv2d
//    //! @{
//
//    interface Subdiv2DStatic {
//        /** creates an empty Subdiv2D object.
//        To create a new empty Delaunay subdivision you need to use the initDelaunay() function.
//         */
//        new (): Subdiv2D;
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
//
//        /** @brief Insert multiple points into a Delaunay triangulation.
//    
//        @param ptvec – Points to insert.
//    
//        The function inserts a vector of points into a subdivision and modifies the subdivision topology
//        appropriately.
//         */
//        insert(ptvec : Array<_types.Point2f>) : void;
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
//
//        /** @brief Returns a list of all edges.
//    
//        @param edgeList – Output vector.
//    
//        The function gives each edge as a 4 numbers vector, where each two are one of the edge
//        vertices. i.e. org_x = v[0], org_y = v[1], dst_x = v[2], dst_y = v[3].
//         */
//        getEdgeList(cb: (edgeList : Array<_matx.Vec4f>) => void) : void;
//
//        /** @brief Returns a list of all triangles.
//    
//        @param triangleList – Output vector.
//    
//        The function gives each triangle as a 6 numbers vector, where each two are one of the triangle
//        vertices. i.e. p1_x = v[0], p1_y = v[1], p2_x = v[2], p2_y = v[3], p3_x = v[4], p3_y = v[5].
//         */
//        getTriangleList(cb : (triangleList : _matx.Vec6f) => void) : void;
//
//        /** @brief Returns a list of all Voroni facets.
//    
//        @param idx – Vector of vertices IDs to consider. For all vertices you can pass empty vector.
//        @param facetList – Output vector of the Voroni facets.
//        @param facetCenters – Output vector of the Voroni facets center points.
//    
//         */
//        getVoronoiFacetList(idx: Array<_st.int>, cb: (facetList: Array<_types.Point2f>, facetCenters: Array<_types.Point2f>) => void): void;
//
//        /** @brief Returns vertex location from vertex ID.
//    
//        @param vertex – vertex ID.
//        @param firstEdge – Optional. The first edge ID which is connected to the vertex.
//        @returns vertex (x,y)
//    
//         */
//        getVertex(vertex: _st.int, cb: (firstEdge: _st.int,vertex :  _types.Point2f) => void) : void;
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
//
//        /** @brief Returns next edge around the edge origin.
//    
//        @param edge – Subdivision edge ID.
//    
//        @returns an integer which is next edge ID around the edge origin: eOnext on the
//        picture above if e is the input edge).
//         */
//        nextEdge(edge : _st.int) : _st.int;
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
//        symEdge(edge : _st.int) : _st.int
//
//        /** @brief Returns the edge origin.
//    
//        @param edge – Subdivision edge ID.
//        @param orgpt – Output vertex location.
//    
//        @returns vertex ID.
//         */
//        edgeOrg(edge: _st.int, cb: (orgpt: _types.Point2f, vertexId: _st.int) => void): void;
//
//        /** @brief Returns the edge destination.
//    
//        @param edge – Subdivision edge ID.
//        @param dstpt – Output vertex location.
//    
//        @returns vertex ID.
//         */
//        edgeDst(edge: _st.int, cb: (dstpt: _types.Point2f, vertexId: _st.int)=>void) : void;
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
//        //std::vector < Vertex > vtx;
//        //! All of the edges
//        qedges: Array<QuadEdge>;
//        //std::vector < QuadEdge > qedges;
//        freeQEdge : _st.int;
//        freePoint : _st.int;
//        validGeometry : boolean;
//
//        recentEdge : _st.int;
//        //! Top left corner of the bounding rect
//        topLeft : _types.Point2f;
//        //! Bottom right corner of the bounding rect
//        bottomRight : _types.Point2f;
//    };
//	
//	
//	
//	
//	
//	
//	  interface VertexStatic {
//        new (): Vertex;
//        new (pt: _types.Point2f, _isvirtual: boolean, _firstEdge: _st.int /*= 0*/): Vertex;
//     
//    }
//
//        interface Vertex
//        {
//            isvirtual(): boolean;
//            isfree(): boolean;
//
//            firstEdge: _st.int;
//            type : _st.int;
//            pt: _types.Point2f;
//        };
//
//
//        interface QuadEdgeStatic {
//            new(): QuadEdge;
//            new(edgeidx: _st.int): QuadEdge;
//        }
//
//        interface QuadEdge
//        {
//            isfree(): boolean;
//
//            next: Array<_st.int>;
//            pt: Array<_st.int>;
//            //int next[4];
//            //int pt[4];
//        };
