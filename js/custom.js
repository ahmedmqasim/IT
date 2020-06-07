/*global $, alert, console*/

$(function () {
	"use strict";

	// change header height

	$(".header").height($(window).height());

	//scroll to features

	$(".header .arrow i").click(function () {

		$("html, body").animate({

			scrollTop: $(".features").offset().top

		}, 1000);
	});

	// show hidden items from open-source

	$(".show-more").click(function () {
		$(".Open-source .hidden").fadeIn(2000);
	});

	//check testimonals

	var leftArrow  = $(".testim .fa-chevron-left"),
        rightArrow = $(".testim .fa-chevron-right");

	function checkClients() {
		if ($(".client:first").hasClass("active")) {
			leftArrow.fadeOut();
		} else {
			leftArrow.fadeIn();
		}

		if ($(".client:last").hasClass("active")) {
			rightArrow.fadeOut();
		} else {
			rightArrow.fadeIn();
		}
	}
	checkClients();

	$(".testim i").click(function () {
		if ($(this).hasClass("fa-chevron-right")) {
			$(".testim .active").fadeOut(100, function () {
				$(this).removeClass("active").next(".client").addClass("active").fadeIn();
				checkClients();
			});
		} else {
				$(".testim .active").fadeOut(100, function () {
				$(this).removeClass("active").prev(".client").addClass("active").fadeIn();
				checkClients();
			});

		}
	});
});


function hideWarning() {
  document.getElementById('no_go').style.display = 'none';
}

function showWarning () {
  document.getElementById('no_go').style.display = 'block';
  document.getElementById('no_go').innerHTML = '<strong>Warning:</strong> App will not work if local storage is disabled or unsupported.';
  console.warn('App will not work if local storage is disabled or unsupported.');
}

function supportsLocalStorage () {
  return typeof localStorage !== 'undefined';
}

function getComments() {
  return JSON.parse(localStorage.getItem('comments')) || [];
}

function saveComment (comments, commentStr, action) {
  if (!commentStr && comments.indexOf(commentStr) < 0) {
    action(err);
  }

  action(undefined, commentStr);

}

function appendToStream(stream, str, index) {
  var li = document.createElement('LI');
  li.setAttribute('data-index', index);
  li.innerHTML = str;
  stream.appendChild(li);
}

function loadComments(stream) {
  var comments = getComments();
  if (comments) {
    for (var i = 0; i < comments.length; i++) {
      appendToStream(stream, comments[i], i);
    }
  }
}

function clearComments(stream) {
  localStorage.removeItem('comments');
  stream.innerHTML = '';
}

if (supportsLocalStorage()) {
  initApp();
} else {
  showWarning();
}

function initApp() {
  hideWarning();

  var commentForm = document.getElementById('comment-form'),
      commentList = document.getElementById('comment-stream'),
      commentInput = document.getElementById('comment-input'),
      removeAll = document.getElementById('remove-all');

  loadComments(commentList);

  removeAll.addEventListener('click', function() {
    clearComments(commentList);
  }, true);

  commentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var commStr = commentInput.value,
        comments = getComments();

    saveComment(comments, commStr, function(err, value) {

      if (err) {
        return;
      }

      comments.push(value);
      localStorage.setItem('comments', JSON.stringify(comments));
      appendToStream(commentList, commStr);
      commentInput.value = '';
    });

  }, true);
}
