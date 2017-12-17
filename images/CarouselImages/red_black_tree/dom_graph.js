
function Point2D(x,y){if(arguments.length>0){this.x=x;this.y=y;}}
Point2D.prototype.clone=function(){return new Point2D(this.x,this.y);};
Point2D.prototype.add=function(that){return new Point2D(this.x+that.x,this.y+that.y);};
Point2D.prototype.addEquals=function(that){this.x+=that.x;this.y+=that.y;return this;};
Point2D.prototype.offset=function(a,b){var result=0;if(!(b.x<=this.x||this.x+a.x<=0)){var t=b.x*a.y-a.x*b.y;var s;var d;if(t>0){if(this.x<0){s=this.x*a.y;d=s/a.x-this.y;}else if(this.x>0){s=this.x*b.y;d=s/b.x-this.y}else{d=-this.y;}}else{if(b.x<this.x+a.x){s=(b.x-this.x)*a.y;d=b.y-(this.y+s/a.x);}else if(b.x>this.x+a.x){s=(a.x+this.x)*b.y;d=s/b.x-(this.y+a.y);}else{d=b.y-(this.y+a.y);}}if(d>0){result=d;}}return result;};
Point2D.prototype.rmoveto=function(dx,dy){this.x+=dx;this.y+=dy;};
Point2D.prototype.scalarAdd=function(scalar){return new Point2D(this.x+scalar,this.y+scalar);};
Point2D.prototype.scalarAddEquals=function(scalar){this.x+=scalar;this.y+=scalar;return this;};
Point2D.prototype.subtract=function(that){return new Point2D(this.x-that.x,this.y-that.y);};
Point2D.prototype.subtractEquals=function(that){this.x-=that.x;this.y-=that.y;return this;};
Point2D.prototype.scalarSubtract=function(scalar){return new Point2D(this.x-scalar,this.y-scalar);};
Point2D.prototype.scalarSubtractEquals=function(scalar){this.x-=scalar;this.y-=scalar;return this;};
Point2D.prototype.multiply=function(scalar){return new Point2D(this.x*scalar,this.y*scalar);};
Point2D.prototype.multiplyEquals=function(scalar){this.x*=scalar;this.y*=scalar;return this;};
Point2D.prototype.divide=function(scalar){return new Point2D(this.x/scalar, this.y/scalar);};
Point2D.prototype.divideEquals=function(scalar){this.x/=scalar;this.y/=scalar;return this;};
Point2D.prototype.compare=function(that){return(this.x-that.x||this.y-that.y);};
Point2D.prototype.eq=function(that){return(this.x==that.x&&this.y==that.y);};
Point2D.prototype.lt=function(that){return(this.x<that.x&&this.y<that.y);};
Point2D.prototype.lte=function(that){return(this.x<=that.x&&this.y<=that.y);};
Point2D.prototype.gt=function(that){return(this.x>that.x&&this.y>that.y);};
Point2D.prototype.gte=function(that){return(this.x>=that.x&&this.y>=that.y);};
Point2D.prototype.lerp=function(that,t){return new Point2D(this.x+(that.x-this.x)*t,this.y+(that.y-this.y)*t);};
Point2D.prototype.distanceFrom=function(that){var dx=this.x-that.x;var dy=this.y-that.y;return Math.sqrt(dx*dx+dy*dy);};
Point2D.prototype.min=function(that){return new Point2D(Math.min(this.x,that.x),Math.min(this.y,that.y));};
Point2D.prototype.max=function(that){return new Point2D(Math.max(this.x,that.x),Math.max(this.y,that.y));};
Point2D.prototype.toString=function(){return this.x+","+this.y;};
Point2D.prototype.setXY=function(x,y){this.x=x;this.y=y;};
Point2D.prototype.setFromPoint=function(that){this.x=that.x;this.y=that.y;};
Point2D.prototype.swap=function(that){var x=this.x;var y=this.y;this.x=that.x;this.y=that.y;that.x=x;that.y=y;};
function ContourSegment(x,y,next){this.offset=new Point2D(x,y);this.next=next;}
ContourSegment.prototype.bridge=function(p1,that,p2){var offset=that.offset;var dx,dy;var r;dx=p2.x+offset.x-p1.x;if(offset.x==0){dy=offset.y;}else{dy=dx*offset.y/offset.x;}r=new ContourSegment(dx,dy,that.next);this.next=new ContourSegment(0,p2.y+offset.y-dy-p1.y,r);return r;};
function Contour(){this.lower_head=null;this.lower_tail=null;this.upper_head=null;this.upper_tail=null;}
Contour.prototype.clone=function(){var clone=new Contour();clone.lower_head=this.lower_head;clone.lower_tail=this.lower_tail;clone.upper_head=this.upper_head;clone.upper_tail=this.upper_tail;return clone;};
Contour.prototype.merge=function(that){var point=new Point2D(0,0);var height=0;var upper=this.lower_head;var lower=that.upper_head;while(upper!=null&&lower!=null){var d=point.offset(lower.offset,upper.offset);point.rmoveto(0,d);height+=d;if(point.x+lower.offset.x<=upper.offset.x){point.rmoveto(lower.offset.x,lower.offset.y);lower=lower.next;}else{point.rmoveto(-upper.offset.x,-upper.offset.y);upper=upper.next;}}if(lower!=null){var b=this.upper_tail.bridge(new Point2D(0,0),lower,point);this.upper_tail=(b.next!=null)?that.upper_tail:b;this.lower_tail=that.lower_tail;}else{var b=that.lower_tail.bridge(point,upper,new Point2D(0,0));if(b.next==null){this.lower_tail=b;}}this.lower_head=that.lower_head;return height;};
function Node(name){this.name=name;this.parent=null;this.children=new Array();this.width=60;this.height=15;this.position=new Point2D(0,0);this.offset=new Point2D(0,0);this.contour=new Contour();this.pad_x=50;this.pad_y=1;this.visible=true;}
Node.prototype.appendChild=function(child){child.parent=this;this.children[this.children.length]=child;};
Node.prototype.layout=function(){var length=this.children.length;for(var i=0;i<length;i++){this.children[i].layout();}if(length>0){this.attachParent(this.join());}else{this.layoutLeaf();}};
Node.prototype.attachParent=function(height){var x=this.pad_x;var y2=(height-this.height)/2-this.pad_y;var y1=y2+this.height+2*this.pad_y-height;this.children[0].offset.setXY(x+this.width,y1);this.contour.upper_head=new ContourSegment(this.width,0,new ContourSegment(x,y1,this.contour.upper_head));this.contour.lower_head=new ContourSegment(this.width,0,new ContourSegment(x,y2,this.contour.lower_head));};
Node.prototype.layoutLeaf=function(){var contour=this.contour;contour.upper_tail=new ContourSegment(this.width+2*this.pad_x,0,null);contour.upper_head=contour.upper_tail;contour.lower_tail=new ContourSegment(0,-this.height-2*this.pad_y,null);contour.lower_head=new ContourSegment(this.width+2*this.pad_x,0,contour.lower_tail);};
Node.prototype.join=function(){var child=this.children[0];var contour=this.contour=child.contour.clone();var height=child.height+2*child.pad_y;var sum=height;for(var i=1;i<this.children.length;i++){var child=this.children[i];var merged_height=contour.merge(child.contour);child.offset.setXY(0,height+merged_height);height=child.height+2*child.pad_y;sum+=height+merged_height;}return sum;};
Node.prototype.plantTree=function(dx,dy){var last_x=0;var last_y=0;this.position.setXY(dx+this.offset.x,dy+this.offset.y);for(var i=0;i<this.children.length;i++){var child=this.children[i];child.plantTree(this.position.x+last_x,this.position.y+last_y);if(i==0){last_x=child.offset.x;}last_y+=child.offset.y;}};
Node.prototype.realize=function(svgParentNode){var x=this.position.x;var y=this.position.y;var half_width=this.width/2;var half_height=this.height/2;for(var i=0;i<this.children.length;i++){var child=this.children[i];if(child.visible){var line=svgDocument.createElement("line");line.setAttribute("x1",x+half_width);line.setAttribute("y1",y);line.setAttribute("x2",child.position.x-child.width/2);line.setAttribute("y2",child.position.y);line.setAttribute("stroke","black");line.setAttribute("stroke-width","2");line.setAttribute("stroke-linecap","round");svgParentNode.appendChild(line);child.realize(svgParentNode);}}var rect=svgDocument.createElement("rect");var text=svgDocument.createElement("text");var tspan=svgDocument.createElement("tspan");var tnode=svgDocument.createTextNode(this.name);rect.setAttribute("x",x-half_width);rect.setAttribute("y",y-half_height);rect.setAttribute("width",this.width);rect.setAttribute("height",this.height);rect.setAttribute("rx","3");rect.setAttribute("ry","3");rect.setAttribute("fill",(this.color)?this.color:"grey");this.rect=rect;text.setAttribute("x",x);text.setAttribute("y",y);text.setAttribute("fill","white");text.setAttribute("text-anchor","middle");this.text=text;tspan.setAttribute("dy","0.33em");tspan.appendChild(tnode);text.appendChild(tspan);svgParentNode.appendChild(rect);svgParentNode.appendChild(text);};