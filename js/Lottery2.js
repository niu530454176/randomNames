$(function () {


	function Lottery(opts) {
		this.init(opts);
	}

	Lottery.prototype = {
		index: 0,//当前index
		endIndex: 0,//奖品index
		total: 0,//总步数
		last: 0,//剩余步数
		quanshu: 2,//圈数
		speed: 140,//速度
		isAnimate: false,//是否正在抽奖中
		init: function (opts) {
			var _this = this;
			_this.$target = opts.$target;
			_this.$td = _this.$target.find('.J-lottery-unit');
			_this.$btn = _this.$target.find('.J-start-btn');

			_this.endIndex = opts.endIndex || _this.endIndex;
			_this.quanshu = typeof opts.quanshu != 'undefined' ? opts.quanshu : _this.quanshu;

			_this.bindEvent();
		},
		bindEvent: function () {
			var _this = this;
			_this.$btn.click(function () {
				_this.go();
			});
		},
		setGift: function (endIndexId) {
			var _this = this;
			_this.endIndex = endIndexId;
		},
		go: function () {//开始抽奖
			var _this = this;
			if(_this.isAnimate) {
				return;
			}
			_this.isAnimate = true;
			_this.speed = 140;

			var lastIndex = 0;//上次欠的步数
			if(_this.index != 0) {//如果上次没欠，就是0
				lastIndex = _this.$td.length - _this.index;
			}
			_this.total = (_this.$td.length * _this.quanshu + 1) + _this.endIndex + lastIndex;

			_this.last = _this.total;
			setTimeout($.proxy(_this.nextOne, _this), _this.speed);
		},
		nextOne: function () {
			var _this = this;
			_this.$td.removeClass('active');
			$('.J-lottery-unit-' + _this.index).addClass('active');
			_this.index++;
			if(_this.index > _this.$td.length - 1) {
				_this.index = 0;
			}
			_this.last--;
			if(_this.total - _this.last < _this.$td.length) {
				_this.speed -= 10;
			}
			if(_this.last < _this.$td.length) {
				_this.speed += 20;
			}
			if(_this.last) {
				setTimeout($.proxy(_this.nextOne, _this), _this.speed);
			} else {
				_this.isAnimate = false;
			}
		}
	};

	var lottery = new Lottery({
		$target: $("#lottery"),
		endIndex: 7,//指的是下标
		quanshu: 3//需要转的圈数
	});

	window.lottery = lottery;

});


