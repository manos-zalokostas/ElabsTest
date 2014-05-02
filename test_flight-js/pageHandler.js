// JavaScript Document

$(document).ready(function() {		

			nav_bar_designer() ;
});



function nav_bar_designer() {

			$.getJSON("http://api.ihackernews.com/page?format=jsonp&callback=?",function(result){
			console.log("POSTs:: ", result);
				
				var post_array = [];
				for(var i=0; i<10; i++){
				post_array.push(result.items[i]);
				}
				post_designer(post_array)
			    });					
}

function post_designer(post) {
	
	var parray = post;
	var postList ='', commList='' ;

			postList = "<ul class='post'>";
			
			for(var p in parray){
				postList += '<li id='+parray[p].id+'>';
				postList += '<h2>' + parray[p].title + '</h2>';

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
			
			$('#post_list > ul > li').each(function(){
	
	 				this.onclick = function(){
	 					
	 					if(document.querySelector('.fullComment')){
	 						$('.fullComment > p').animate({'opacity':0, 'marginTop':'30%'}
	 						, function(){$('.fullComment').animate({'left': '100%'}
	 						, function(){$('.fullComment').remove()} );
	 						})
	 						
	 					}
	 					if(document.querySelector('ul.post > li.selected')){
	 						$('ul.post>li.selected').removeClass();
	 					}
	 					$(this).addClass('selected');
					
					$.getJSON("http://hndroidapi.appspot.com/nestedcomments/format/json/id/"+this.id+"?callback=?"
					,function(result){
					console.log('COMMENTs:: ', result);
					
					var comments = result.items;
					var counter = 0;
						
						commList = '<ul class="comment">';
						
						for(var c in comments){
						
						if(counter>=20) continue;

						if(comments.length <14 && comments.length> 7) {	commList += '<li style="width:7%">'; }
						else if(comments.length <=7) {commList += '<li style="width:15%">';}
						else{commList += '<li>';}
						
						commList += '<p>' + comments[c].comment + '</p>';
						
						commList +='<div class="comment_extra">'
//						commList +='<span class="cch" title="Children Length"> ' +comments[c].children.length+'</span>'
//						commList +='<span class="cgp" title="Grayed Output Percent> ' +comments[c].grayedOutPercent+'</span>'
						commList +='<span class="ctm"  title="Posted Ago"> ' +comments[c].time+'</span>'
						commList +='<span class="cusr" title="Username"> ' +comments[c].username+'</span>'
						commList +='</div>'						
						
						commList += '</li>';
						counter++;
						}		
						commList += '</ul>';
						
						$('#comment_list').html(commList.replace(/__BR__/g, "<br />"));
						
						
						$('#comment_list > ul > li').each(function(){
							
							$(this).animate({'opacity': 1, 'marginTop': 0});
							
							this.onmouseenter = function(){showTempComment(this);};
							this.onmouseleave = function(){clearTempComment();};
							this.onclick = function(){
			 					if(document.querySelector('ul.comment> li.selected')){
			 						$('ul.comment>li.selected').removeClass();
			 					}
			 					$(this).addClass('selected');								
								previewComment();
								};

						})
					})
					}
			})
			}	

function previewComment(){

	var currComment = $('.hoverComment').html();
	var divComment = '<div class="fullComment">'+currComment+'</div>';
	
	clearTempComment();
	
	if(!document.querySelector('.fullComment'))	{
		$('#context').append(divComment);
		$('.fullComment').animate({'left': 0}, function(){$('.fullComment > p').animate({"marginTop":"4%", "opacity":1})});
		}
	else {
		$('.fullComment > p').css({'marginTop': '30%', 'opacity': 0}).html(currComment);
		$('.fullComment > p').animate({"marginTop":"4%", "opacity":1})
		}
}

function showTempComment(element){
	//console.log(this);
	
	var targetElement = element;
	
	var tempCommentDiv = document.querySelector('.hoverComment')
	var xCoords = ($(targetElement).offset().left) + 'px';
	var yCoords = ($(targetElement).offset().top - 200) + 'px';
	
	
	if(tempCommentDiv){tempCommentDiv.parentNode.removeChild(tempCommentDiv)}
	var currComment = targetElement.children[0].innerHTML;
	//console.log(currComment);
	var tempHoverDiv = '<div class="hoverComment" style="top:'+yCoords +'; left:'+xCoords+'"><p>'+currComment+'</p></div>';
	
	targetElement.innerHTML = tempHoverDiv + targetElement.innerHTML;
	
	$('.hoverComment').animate({'height':'20%'}, function(){$('.hoverComment > p').animate({'opacity':'1'})});
}

function clearTempComment(){
	
	var tempCommentDiv = document.querySelector('.hoverComment')
	if(tempCommentDiv){tempCommentDiv.parentNode.removeChild(tempCommentDiv)}
}









