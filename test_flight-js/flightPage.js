
jQuery(function($) {
	'use strict';


var dataRetrieveTitles = flight.component(function(){
			this.retrieveComments= function(e, data){
					var elem = this;
					
					$.getJSON("http://hndroidapi.appspot.com/nestedcomments/format/json/id/"+data.id+"?callback=?"
					, function(result){
					elem.trigger('designCommentsList', {comments: result});
					})
			}	
			this.after('initialize', function(){
					var elem = this;
					
					$.getJSON("http://api.ihackernews.com/page?format=jsonp&callback=?"
					, function(result){
					var titles = [];
					for(var i=0; i<10; i++){
					titles.push(result.items[i]);
					}
					elem.trigger('designTitlesList', {titles: titles});	
					});
					this.on('getIDComments', this.retrieveComments);
			});
});

var uiDesignCommentsList = flight.component(function(){
			this.defaultAttrs({
						commentSelector: '#comment_list>ul>li'
			})		
			this.designComments = function(e, data){
						var comments = data.comments.items;		

						var counter = 0;
						var commentsList = '', commentTitle = '';
						
						commentsList = '<ul class="comment">';
						for(var c in comments){
						if(counter>=20) continue;	
						var comm = comments[c].comment;
						var charAt = 80;
						while(comm[charAt] !=' ' && comm[charAt]){
							charAt++;
		//console.log('CHARAT:: ', charAt, comm[charAt]);						
						}
						commentTitle = comm.substring(0, charAt+1) + '...';
						commentsList += '<li>';
						commentsList += '<b>' + commentTitle + '</b>';
						commentsList += '<p>' + comments[c].comment + '</p>';
						commentsList +='<div class="comment_extra">'
						//	commentsList +='<span class="cch" title="Children Length"> ' +comments[c].children.length+'</span>'
						//	commentsList +='<span class="cgp" title="Grayed Output Percent> ' +comments[c].grayedOutPercent+'</span>'
						commentsList +='<span class="ctm"  title="Posted Ago"> ' +comments[c].time+'</span>'
						commentsList +='<span class="cusr" title="Username"> ' +comments[c].username+'</span>'
						commentsList +='</div>'						
						commentsList += '</li>';
						counter++;
						}		
						commentsList += '</ul>';
						
						$('#comment_list').html(commentsList.replace(/__BR__/g, "<br />"));		
						this.trigger('#scroll_buttons', 'revealScrollBar');								
			}
			this.previewComment = function(e){
						var targetElement = $(e.target)[0];
	
						if(targetElement.tagName == 'LI'){
						var xCoords = ($(targetElement).offset().left) + 'px';
						var yCoords = (Math.round(100*((screen.height)/$(targetElement).offset().top))-88) + '%';
						
						var tempCommentDiv = document.querySelector('.hoverComment')
						var currComment = $(targetElement).find('p').html();
//console.log('TAGET_ELEMENT:: ', targetElement);						
						var tempHoverDiv = '<div class="hoverComment" style="top:'+yCoords +'; left:'+xCoords+'"><p>'+currComment+'</p></div>';
						
						if(tempCommentDiv){$(tempCommentDiv).remove()}
						targetElement.innerHTML = tempHoverDiv + targetElement.innerHTML;
						
						$('.hoverComment').animate({'height':'30%'}, function(){$('.hoverComment > p').animate({'opacity':'1'})});						
						}
			}
			this.displayComment = function(e){
						if(document.querySelector('ul.comment > li.selected')){
						$('ul.comment>li.selected').removeClass();
						}
						var $this = $(e.target);

						while(true){
						if($this[0].nodeName == 'LI'){
						$($this).addClass('selected');
						break;
						}
						$this = $this.parent();
						}
						this.trigger('#preview_area', 'designCommentView');
			}
			this.after('initialize', function(){
						this.on(document, 'designCommentsList', this.designComments);
						this.on('click', {commentSelector: this.displayComment});
						this.on('mouseover', {commentSelector: this.previewComment})				
			})
})

var uiDesignCommentView = flight.component(function(){
			this.designCommentView = function(){
						var currComment = $('.hoverComment').html();						
						var divComment = '<div class="fullComment">'+currComment+'</div>';
						var tempCommentDiv = document.querySelector('.hoverComment')
		
						if(tempCommentDiv){$(tempCommentDiv).remove()}
						if(!document.querySelector('.fullComment'))	{
						$('#preview_area').append(divComment);
						$('.fullComment').animate({'left': 0}, function(){$('.fullComment > p').animate({"marginTop":"4%", "opacity":1})});
						}
						else {
						$('.fullComment p').css({'marginTop': '30%', 'opacity': 0}).html(currComment);
						$('.fullComment p').animate({"marginTop":"4%", "opacity":1})
						}						
			}
			this.clearCommentArea = function(){
						if(document.querySelector('.fullComment')){
						$('.fullComment > p').animate({'opacity':0, 'marginTop':'30%'}
	 					, function(){$('.fullComment').animate({'left': '100%'}
	 					, function(){$('.fullComment').remove()} );
	 					})
						}
			}
			this.after('initialize', function(){
						this.on('designCommentView', this.designCommentView);
						this.on(document, 'designCommentsList', this.clearCommentArea);
			});
});

var uiDesignTitlesList = flight.component(function(){
			this.defaultAttrs({
						titleSelector: '#post_list>ul>li'
			})	
			this.designTitles = function(e, data){
						var parray = data.titles;
						var postList ='', commentsList='' ;
					
						postList = "<ul class='post'>";
						for(var p in parray){
						postList +='<li id='+parray[p].id+'>';
						postList +='<div><h2 title="'+ parray[p].title + '">' + parray[p].title + '</h2></div>';
						postList +='<div class="post_extra">'
						postList +='<span class="pcc" title="Comment Count"> ' +parray[p].commentCount+'</span>'
						postList +='<span class="ppt" title="Points"> ' +parray[p].points+'</span>'
						postList +='<span class="ppa" title="Posted Time"> ' +parray[p].postedAgo+'</span>'
						postList +='<span class="ppb" title="Posted By"> ' +parray[p].postedBy+'</span>'
						postList +='<span class="pul" title="Username"> ' +parray[p].url+'</span>'
						postList +='</div>'
						postList += '</li>';
						}
						postList += "</ul>";
						
						$('#post_list').html(postList);	
			}
			this.retrieveIDComments = function(e, data){
						if(document.querySelector('ul.post > li.selected')){
 						$('ul.post>li.selected').removeClass();
						}
						var $this = $(e.target);
						while(true){
						if($this[0].nodeName == 'LI'){
						$($this).addClass('selected');
						break;
						}
						$this = $this.parent();
						}			
						
						this.trigger('getIDComments', {id: $this.attr('id')});				
			}
			this.after('initialize', function(){
						this.on(document, 'designTitlesList', this.designTitles);
						this.on('click', {titleSelector: this.retrieveIDComments});
			})
});	


var uiScrollCommentList= flight.component(function(){
			this.handleScrollDirection = function(e, data){
						var pos = document.querySelector('.comment').style.left;
						var currPosition= (pos)? (parseInt(pos)) : 0;
						
						if($(e.target).context.textContent =='>'){
						document.querySelector('.comment').style.left = (currPosition-30)+'%' ;
						}
						else if($(e.target).context.textContent =='<'){
						console.log('<');
						document.querySelector('.comment').style.left = (currPosition+30)+'%' ;
						}
						else{}
			}
			this.revealScrollBar = function(){
						$('#scroll_buttons').animate({'opacity':1, 'left': 0, 'width':'100%'});
			}
			this.after('initialize', function(){
						this.on('click', this.handleScrollDirection);
						this.on('revealScrollBar', this.revealScrollBar)
			});
});

dataRetrieveTitles.attachTo(document);	
uiDesignTitlesList.attachTo('#post_list');
uiDesignCommentsList.attachTo('#comment_list');
uiDesignCommentView.attachTo('#preview_area');

uiScrollCommentList.attachTo('#scroll_buttons');
})
	













//jQuery(function($) {
//	'use strict';
//
//
//var dataRetrieveTitles = flight.component(function(){
//			this.retrieveComments= function(e, data){
//					var elem = this;
//					
//					$.getJSON("http://hndroidapi.appspot.com/nestedcomments/format/json/id/"+data.id+"?callback=?"
//					, function(result){
//					elem.trigger('designCommentsList', {comments: result});
//					})
//			}	
//			this.after('initialize', function(){
//					var elem = this;
//					
//					$.getJSON("http://api.ihackernews.com/page?format=jsonp&callback=?"
//					, function(result){
//					var titles = [];
//					for(var i=0; i<10; i++){
//					titles.push(result.items[i]);
//					}
//					elem.trigger('designTitlesList', {titles: titles});	
//					});
//					this.on('getIDComments', this.retrieveComments);
//			});
//});
//
//var uiDesignCommentsList = flight.component(function(){
//			this.defaultAttrs({
//						commentSelector: '#comment_list>ul>li'
//			})		
//			this.designComments = function(e, data){
//						var comments = data.comments.items;		
//
//						var counter = 0;
//						var commentsList = '', commentTitle = '';
//						
//						commentsList = '<ul class="comment">';
//						for(var c in comments){
//						if(counter>=20) continue;	
//						var comm = comments[c].comment;
//						var charAt = 80;
//						while(comm[charAt] !=' ' && comm[charAt]){
//							charAt++;
//		//console.log('CHARAT:: ', charAt, comm[charAt]);						
//						}
//						commentTitle = comm.substring(0, charAt+1) + '...';
//						commentsList += '<li>';
//						commentsList += '<b>' + commentTitle + '</b>';
//						commentsList += '<p>' + comments[c].comment + '</p>';
//						commentsList +='<div class="comment_extra">'
//						//	commentsList +='<span class="cch" title="Children Length"> ' +comments[c].children.length+'</span>'
//						//	commentsList +='<span class="cgp" title="Grayed Output Percent> ' +comments[c].grayedOutPercent+'</span>'
//						commentsList +='<span class="ctm"  title="Posted Ago"> ' +comments[c].time+'</span>'
//						commentsList +='<span class="cusr" title="Username"> ' +comments[c].username+'</span>'
//						commentsList +='</div>'						
//						commentsList += '</li>';
//						counter++;
//						}		
//						commentsList += '</ul>';
//						
//						$('#comment_list').html(commentsList.replace(/__BR__/g, "<br />"));						
//			}
//			this.previewComment = function(e){
//						var targetElement = $(e.target)[0];
//	
//						if(targetElement.tagName == 'LI'){
//						var xCoords = ($(targetElement).offset().left) + 'px';
//						var yCoords = (Math.round(100*((screen.height)/$(targetElement).offset().top))-88) + '%';
//						
//						var tempCommentDiv = document.querySelector('.hoverComment')
//						var currComment = $(targetElement).find('p').html();
////console.log('TAGET_ELEMENT:: ', targetElement);						
//						var tempHoverDiv = '<div class="hoverComment" style="top:'+yCoords +'; left:'+xCoords+'"><p>'+currComment+'</p></div>';
//						
//						if(tempCommentDiv){$(tempCommentDiv).remove()}
//						targetElement.innerHTML = tempHoverDiv + targetElement.innerHTML;
//						
//						$('.hoverComment').animate({'height':'30%'}, function(){$('.hoverComment > p').animate({'opacity':'1'})});						
//						}
//			}
//			this.displayComment = function(e){
//						if(document.querySelector('ul.comment > li.selected')){
//						$('ul.comment>li.selected').removeClass();
//						}
//						var $this = $(e.target);
//
//						while(true){
//						if($this[0].nodeName == 'LI'){
//						$($this).addClass('selected');
//						break;
//						}
//						$this = $this.parent();
//						}
//						this.trigger('#preview_area', 'designCommentView');
//			}
//			this.after('initialize', function(){
//						this.on(document, 'designCommentsList', this.designComments);
//						this.on('click', {commentSelector: this.displayComment});
//						this.on('mouseover', {commentSelector: this.previewComment})				
//			})
//})
//
//var uiDesignCommentView = flight.component(function(){
//			this.designCommentView = function(){
//						var currComment = $('.hoverComment').html();						
//						var divComment = '<div class="fullComment">'+currComment+'</div>';
//						var tempCommentDiv = document.querySelector('.hoverComment')
//		
//						if(tempCommentDiv){$(tempCommentDiv).remove()}
//						if(!document.querySelector('.fullComment'))	{
//						$('#preview_area').append(divComment);
//						$('.fullComment').animate({'left': 0}, function(){$('.fullComment > p').animate({"marginTop":"4%", "opacity":1})});
//						}
//						else {
//						$('.fullComment p').css({'marginTop': '30%', 'opacity': 0}).html(currComment);
//						$('.fullComment p').animate({"marginTop":"4%", "opacity":1})
//						}						
//			}
//			this.clearCommentArea = function(){
//						if(document.querySelector('.fullComment')){
//						$('.fullComment > p').animate({'opacity':0, 'marginTop':'30%'}
//	 					, function(){$('.fullComment').animate({'left': '100%'}
//	 					, function(){$('.fullComment').remove()} );
//	 					})
//						}
//			}
//			this.after('initialize', function(){
//						this.on('designCommentView', this.designCommentView);
//						this.on(document, 'designCommentsList', this.clearCommentArea);
//			});
//});
//
//var uiDesignTitlesList = flight.component(function(){
//			this.defaultAttrs({
//						titleSelector: '#post_list>ul>li'
//			})	
//			this.designTitles = function(e, data){
//						var parray = data.titles;
//						var postList ='', commentsList='' ;
//					
//						postList = "<ul class='post'>";
//						for(var p in parray){
//						postList +='<li id='+parray[p].id+'>';
//						postList +='<div><h2 title="'++'">' + parray[p].title + '</h2></div>';
//						postList +='<div class="post_extra">'
//						postList +='<span class="pcc" title="Comment Count"> ' +parray[p].commentCount+'</span>'
//						postList +='<span class="ppt" title="Points"> ' +parray[p].points+'</span>'
//						postList +='<span class="ppa" title="Posted Time"> ' +parray[p].postedAgo+'</span>'
//						postList +='<span class="ppb" title="Posted By"> ' +parray[p].postedBy+'</span>'
//						postList +='<span class="pul" title="Username"> ' +parray[p].url+'</span>'
//						postList +='</div>'
//						postList += '</li>';
//						}
//						postList += "</ul>";
//						
//						$('#post_list').html(postList);	
//			}
//			this.retrieveIDComments = function(e, data){
//						if(document.querySelector('ul.post > li.selected')){
// 						$('ul.post>li.selected').removeClass();
//						}
//						var $this = $(e.target);
//						while(true){
//						if($this[0].nodeName == 'LI'){
//						$($this).addClass('selected');
//						break;
//						}
//						$this = $this.parent();
//						}			
//						
//						this.trigger('getIDComments', {id: $this.attr('id')});
//			}
//			this.after('initialize', function(){
//						this.on(document, 'designTitlesList', this.designTitles);
//						this.on('click', {titleSelector: this.retrieveIDComments});
//			})
//});	
//
//
//
//dataRetrieveTitles.attachTo(document);	
//uiDesignTitlesList.attachTo('#post_list');
//uiDesignCommentsList.attachTo('#comment_list');
//uiDesignCommentView.attachTo('#preview_area');
//
//})
//	
//
//
//
//
//
//
//
