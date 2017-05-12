/**
 * Created by Administrator on 2017/5/11.
 */
/*!Name: showImgSwitch.js
 * Date: 2017-5-9 18:19:13 */
define("MOD_ROOT/comment/showImgSwitch", function (require, exports, module) {
	var t = function (t) {
		this.init(t)
	};
	return t.prototype = {
		$showImgSwitch: null,
		$thumbList: null,
		$thumbListUl: null,
		$photoImg: null,
		imgNum: 0,
		url: "",
		currentPage: 1,
		dataPage: 1,
		totalPage: 0,
		currIndex: 0,
		imgCommentCount: 0,
		imgArr: [],
		onUpdate: $.noop,
		onReady: $.noop,
		template: {},
		isInit: !0,
		init: function (t) {
			var e = this;
			t.showImgSwitch = t.showImgSwitch || ".comments-showImgSwitch-wrap",
				t.thumbList = t.thumbList || ".thumb-list",
				t.thumbPrevBtn = t.thumbPrevBtn || ".J-thumb-prev",
				t.thumbNextBtn = t.thumbNextBtn || ".J-thumb-next",
				t.cursorLeft = t.cursorLeft || ".J-cursor-left",
				t.cursorRight = t.cursorRight || ".J-cursor-right",
				t.photoImg = t.photoImg || ".J-photo-img",
				e.$showImgSwitch = $(t.showImgSwitch),
				e.$thumbList = $(t.thumbList),
				e.$thumbListUl = e.$thumbList.find("ul"),
				e.thumbPrevBtn = t.thumbPrevBtn,
				e.thumbNextBtn = t.thumbNextBtn,
				e.$photoImg = $(t.photoImg),
				e.cursorLeft = t.cursorLeft,
				e.cursorRight = t.cursorRight,
				e.template.thumbLi = '<li><a href="javascript:;"><img width="76" height="76" src="${imageUrl}"></a></li>',
				e.onUpdate = t.onUpdate || e.onUpdate, e.onReady = t.onReady || e.onReady,
				e.currIndex = 0,
				e.imgNum = t.imgNum,
				e.url = t.url,
				e.wideVersion = t.wideVersion,
				e.imgArr = [],
				e._getData()
		},
		_getData: function () {
			var t = this;
			/debug=showImgSwitch/.test(location.href) && console.log("\u5f00\u59cb\u83b7\u53d6\u6570\u636e \u9875\u7801\uff1a" + t.dataPage),
				$.ajax({
				url: t.url,
				data: {page: t.dataPage, pageSize: t.imgNum},
				dataType: "jsonp",
				success: function (e) {
					t._setData(e)
				}
			})
		},
		_setData: function (t) {
			var e = this;
			/debug=showImgSwitch/.test(location.href) && console.log("\u7ed3\u675f\u83b7\u53d6\u6570\u636e \u9875\u7801\uff1a" + e.dataPage);
			var i = t.imgComments;
			e.imgCommentCount = i.imgCommentCount, e.totalPage = Math.ceil(i.imgCommentCount / e.imgNum);
			var r = "";
			for (var n in i.imgList)e.imgArr.push(i.imgList[n]), i.imgList[n].imageUrl = e._replaceThumbImgSize(i.imgList[n].imageUrl), r += e.template.thumbLi.process(i.imgList[n]);
			e._appendThumb(r), 1 == e.isInit && (e._chooseIndex(e.currIndex), e._bindEvents(), e.isInit = !1), e.onReady(e.imgCommentCount)
		},
		_bindEvents: function () {
			var t = this;
			t.$showImgSwitch.delegate(t.cursorLeft, "click", function () {
				t.currIndex > 0 && t.currIndex--, t._chooseIndex(t.currIndex)
			}), t.$showImgSwitch.delegate(t.cursorRight, "click", function () {
				t.currIndex + 1 < t.imgArr.length ? (t.currIndex++, t._chooseIndex(t.currIndex)) : /debug=showImgSwitch/.test(location.href) && console.log("\u4e0d\u80fd\u518d\u5f80\u540e\u9009\u4e86")
			}), t.$showImgSwitch.delegate("li", "click", function () {
				t.currIndex = $(this).index(), t._chooseIndex(t.currIndex)
			}), t.$showImgSwitch.delegate(t.thumbPrevBtn, "click", function () {
				t.currentPage > 1 && (t.currentPage--, t.currIndex = (t.currentPage - 1) * t.imgNum, t._chooseIndex(t.currIndex))
			}), t.$showImgSwitch.delegate(t.thumbNextBtn, "click", function () {
				var e = Math.ceil(t.imgArr.length / t.imgNum);
				t.currentPage < t.totalPage && t.currentPage + 1 <= e && (t.currentPage++, t.currIndex = (t.currentPage - 1) * t.imgNum,
					t._chooseIndex(t.currIndex))
			}), $(window).bind("keydown", $.proxy(t._onKeydownHandler, t))
		},
		_appendThumb: function (t) {
			this.$thumbListUl.append(t)
		},
		_chooseIndex: function (t) {
			var e = this, i = e.imgArr[t];
			if (!i)return !1;
			e.currentPage = Math.ceil((t + 1) / e.imgNum), e._updatePhoto(i, t), e._checkThumbList(t), e._checkNeedGetData(), e.onUpdate(i)
		},
		_updatePhoto: function (t, e) {
			var i = this, r = i._replaceImgSize(t.imageUrl);
			i.$photoImg.attr("src", r), i.$showImgSwitch.find(i.cursorLeft).toggleClass("disable", 0 == e), i.$showImgSwitch.find(i.cursorRight).toggleClass("disable", e == i.imgCommentCount - 1)
		},
		_checkThumbList: function (t) {
			var e = this;
			e.$thumbListUl.find("li").removeClass("selected"), e.$thumbListUl.find("li:eq(" + t + ")").addClass("selected");
			var i = -(e.currentPage - 1) * (e.imgNum + 1) * e.$thumbListUl.find("li").width();
			e.$thumbListUl.stop().animate({marginLeft: i});
			var r = e.$showImgSwitch.find(e.thumbPrevBtn), n = e.$showImgSwitch.find(e.thumbNextBtn);
			e.currentPage <= 1 ? r.addClass("i-prev-disable") : r.removeClass("i-prev-disable"), e.currentPage >= e.totalPage ? n.addClass("i-next-disable") : n.removeClass("i-next-disable")
		},
		_checkNeedGetData: function () {
			var t = this;
			t.currentPage < t.totalPage ? t.dataPage < t.currentPage + 1 && (t.dataPage++, t._getData()) : /debug=showImgSwitch/.test(location.href) && console.log("\u6700\u540e\u4e00\u9875")
		},
		_replaceThumbImgSize: function (t) {
			return t = t.replace("shaidan", "n1"), t.replace("jfs", "s76x76_jfs")
		},
		_replaceImgSize: function (t) {
			var e = this.wideVersion ? "s760x500_jfs" : "s542x500_jfs";
			return t.replace("s76x76_jfs", e)
		},
		_onKeydownHandler: function (t) {
			var e = this;
			37 == t.keyCode ? e.$showImgSwitch.find(e.cursorLeft).trigger("click") : 39 == t.keyCode && e.$showImgSwitch.find(e.cursorRight).trigger("click")
		}
	}, t
});