
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
	const heading = $('header h2')
	const headingSon = $('header p')
	const cdthumb = $('.cd-thumb')
	const audio = $('#audio')
	const cd = $('.cd')
	const playBtn = $('.btn-toggle-play')
	const player = $('.player')
	const progress = $('#progress')
	const volume = $('#volumeRange')
	const currenttime = $('#currentTime')
	const durationAudio = $('#duration')
	const next = $('.btn-next')
	const prev = $('.btn-prew')
	const random =$('.btn-random')
	const repeat = $('.btn-repeat')
	const playlist = $('.playlist')
	const volumeBtn = $('#volumeBtn')
	const volumeChild = $('#icon-volume')
	const volumeRange = $('#volumeRange')
	const Home = $('.Home-child')
	const Profile = $('.profile')
	const profileInterFace = $('#profileInterface')
	const homeInterFace = $('#HomeInterFace')
	const STORAGE_KEY = 'TruongPro'
	    
const app = {
	currentIndex:1,
	isPlay:false,
	isRandom:false,
	isRepeat:false,
	config: JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
	setConfig: function(key,value) {
		this.config[key] = value
		localStorage.setItem(STORAGE_KEY,JSON.stringify(this.config))
	},
	songs: [
		{
			name:'Thêm Bao Nhiêu Lâu',
			singer:'ĐạtG',
			path: "./music/yt1s.com - Thêm Bao Nhiêu Lâu  Đạt G  OFFICIAL MV.mp3",
			image: './download (1).jpg'
		},
		{
			name:'Anh Tự Do Nhưng Cô Đơn',
			singer: 'ĐạtG',
			path: './music/yt1s.com - Đạt G  Anh Tự Do Nhưng Cô Đơn  Live at DearOcean DatGMusic .mp3',
			image: './download (1).jpg'
		},
		{
			name:'Bánh Mì Không',
			singer:'ĐạtG',
			path: './music/yt1s.com - Bánh Mì Không  ĐạtG x DuUyên  OFFICIAL MV.mp3',
			image: './download (1).jpg'
		},
		{
			name:'Ngày Mai Em Đi Mất',
			singer:'ĐạtG',
			path: './music/yt1s.com - Đạt G  Ngày Mai Em Đi Mất  Live at DearOcean DatGMusic.mp3',
			image: './download (1).jpg'
		},
		{
			name:'Khó Vẽ Nụ Cười',
			singer:'ĐạtG',
			path:'./music/yt1s.com - Khó Vẽ Nụ Cười Audio  ĐạtG x DuUyên.mp3',
			image: './download (1).jpg'
		},
		{
			name:'Buồn Không Em',
			singer:'ĐạtG',
			path: './music/yt1s.com - Buồn Không Em  Đạt G  OFFICIAL MV.mp3',
			image: './download (1).jpg'
		},
		{
			name :'Quẻ Bói',
			singer:'QUANG NHẬT REMIX (GUHANCCI TEAM)',
			path: './music/yt1s.com - QUẺ BÓI  QUANG NHẬT REMIX GUHANCCI TEAM  NHẠC TREND KẺ GẠT GIÒ SIRIUS.mp3',
			image:'./img/Trường.jpg'
		},
		
	],
	reder:function(){
		const htmls = this.songs.map((song,index)=>{
			// thêm active vào
			const isActive = index === this.currentIndex ? 'active' : ''
			
			return `
			<div class="song ${isActive}" data-index=${index}>
			<div class="thumb" style="background-image: url('${song.image}');">

			</div>
			<div class="body">
				<h3 class="title">
					${song.name}
				</h3>
				<p class="author">
					${song.singer}
				</p>
			</div>
			<div class="option btn-option ">
				<i class=" fas fa-ellipsis-h"></i>
			</div>
		</div>
			`
		})
		$('.playlist').innerHTML = htmls.join('')
	},
	defineProperties:function(){
		Object.defineProperty(this,'currentSong',{
			get:function(){
				return this.songs[this.currentIndex]
			}
		})
	},
	HandleEvent:function(){
		const cdWidth = cd.offsetWidth
		const _this = this
		//xử lý cuộn
		document.onscroll = function(){
			const scrollTop = window.scrollY
			const newWidth = cdWidth - scrollTop
			cd.style.width = newWidth>0 ? newWidth +'px':0 /* nếu nó lớn hơn 0 nó sẽ xử dụng độ lớn +px nếu bé hơn nó sẽ bằng 0*/
			cd.style.opacity = newWidth/cdWidth
		}
		//xử lý phát ngừng âm thanh
		playBtn.onclick = function(){
			if (audio.paused){
				audio.play();
				player.classList.add('playing');
				cdthumbAnimate.play()
				
			} else {
				audio.pause();
				player.classList.remove('playing');
				cdthumbAnimate.pause()
			}
		};
		// xử lý quay ảnh 
		const cdthumbAnimate = cdthumb.animate([ 
			{transform: 'rotate(360deg)'}
		], {
			duration: 10000,
			iterations: Infinity
		})
		cdthumbAnimate.pause()	
		// xử lý random
		random.onclick = function(e){
			_this.isRandom = !_this.isRandom
			random.classList.toggle('active', _this.isRandom)
			_this.setConfig('isRandom', _this.isRandom)
			}	
		//xử lý repeat
		repeat.onclick = function(e){
			_this.isRepeat= !_this.isRepeat
			repeat.classList.toggle('active', _this.isRepeat)
			_this.setConfig('isRepeat', _this.isRepeat)
		}
		// khi next song
		next.onclick = function(){
			if (!_this.isRandom){
				_this.nextsong()
			}else{
				_this.playRandomSong()
			}
			audio.play()
			player.classList.add('playing')
			_this.reder()
			_this.ScrollToActiveSong()
		}
		//khi prev song
		prev.onclick = function(){
			if (!_this.isRandom){
				_this.prevsong()
			}else{
				_this.playRandomSong()
			}
			audio.play()
			player.classList.add('playing')
			_this.reder()
			_this.ScrollToActiveSong()
		}
		// xử lý khi kết thúc bài hát
		audio.onended = function(){
			if (_this.isRepeat){
				audio.play()
			}else{
				if (_this.isRandom){
					_this.nextsong()
				}else{
					_this.playRandomSong()
				}
				audio.play()
			}
			//cập nhập active mỗi khi hết bài
			var currentSongIndex = _this.currentIndex;
			var songs = document.querySelectorAll('.song');
			songs.forEach(function(song, index) {
				if (index === currentSongIndex) {
					song.classList.add('active');
				} else {
					song.classList.remove('active');
				}
			})		
			_this.ScrollToActiveSong()

		}
		//xử lý khi tua bài 
		progress.addEventListener('input', function(e){
			const seekTime = audio.duration /100 *e.target.value
			audio.currentTime = seekTime
			
		})
		// tăng giảm tiếng
		volume.oninput = function(){
			audio.volume = volume.value
		}
		// xử lý khi thanh âm thanh bị thay đổi
		audio.addEventListener('volumechange',function(){
			if (audio.volume ===0 || audio.muted){
				volumeChild.classList.remove('fa-volume-up')
				volumeChild.classList.add('fa-volume-mute')
			} else {
				volumeChild.classList.remove('fa-volume-mute')
				volumeChild.classList.add('fa-volume-up')
			}
		})
		// xử lý nút âm lượng khi click vào
		volumeBtn.addEventListener("click", function() {
			if (volumeRange.value === 0 || audio.muted) {
				// Nếu đang tắt âm thanh, bật lại âm thanh và đặt giá trị thanh âm lượng về 0.5 hoặc mức giá trị bạn mong muốn mặc định
				volumeRange.value = 0.5;
				audio.muted = false
				volumeChild.classList.remove("fa-volume-mute");
				volumeChild.classList.add("fa-volume-up");
			} else {
				// Nếu đang có âm thanh, tắt âm thanh và đặt giá trị thanh âm lượng về 0
				volumeRange.value = 0;
				audio.muted = true
				volumeChild.classList.remove("fa-volume-up");
				volumeChild.classList.add("fa-volume-mute");
			}
		});
		//thời gian chạy của audio
		audio.ontimeupdate = function(){
			const currentMinute = Math.floor(audio.currentTime/60)
			const currentSecond = Math.floor(audio.currentTime%60)
			currenttime.textContent = `${currentMinute}:${currentSecond < 10 ? '0': ''}${currentSecond}`
			// khi tiến độ bài hát bị thay đổi
			if (audio.duration){
				const progressPercen = Math.floor(audio.currentTime / audio.duration * 100)
				progress.value = progressPercen
				
			} 
			
		}
		//hiển thị tổng thời gian bài hát
		audio.onloadedmetadata = function() {
			const durationMinute = Math.floor(audio.duration/60)
			const durationSecond = Math.floor(audio.duration%60)
			durationAudio.textContent = `${durationMinute}:${durationSecond <10 ? 0 : ''}${durationSecond}`
		}

		playlist.onclick = function(e){
			// lấy phần tử cha gần nhất từ DOM
			const songNode = e.target.closest('.song:not(.active)')
			const optionNode = e.target.closest('.option')
			if (!optionNode && songNode ) {
				if (songNode){
					_this.currentIndex =Number(songNode.dataset.index)
					_this.LoadSongInInterface()
					_this.reder()
					player.classList.add('playing')
					audio.play()
				}
				if (optionNode) {		
			}}
		}
	},
	HOME:function(){
			Home.classList.add('active');
			if (Home){
				Home.onclick = function() {
					// Hiển thị giao diện âm nhạc
					homeInterFace.style.display = 'block'
					// Ẩn giao diện profile
					profileInterFace.style.display = 'none';
					// Thêm lớp active cho nút "Home" và loại bỏ lớp active khỏi nút "Profile"
					Home.classList.add('active');
					Profile.classList.remove('active');
				}
			if (Profile){
					// Định nghĩa sự kiện click cho nút "Profile"
					Profile.onclick = function() {
					// Hiển thị giao diện profile
					homeInterFace.style.display = 'none';
					// Ẩn giao diện âm nhạc
					profileInterFace.style.display = 'block';
					// Thêm lớp active cho nút "Profile" và loại bỏ lớp active khỏi nút "Home"
					Home.classList.remove('active');
					Profile.classList.add('active');
		}
						
			}
		}
	},
	
	nextsong: function(){
		this.currentIndex++
		if (this.currentIndex>=this.songs.length){
			this.currentIndex =0
		}
		this.LoadSongInInterface()
	},
	prevsong:function(){
		this.currentIndex--
		if (this.currentIndex< 0){
			this.currentIndex =this.songs.length-1
		}
		this.LoadSongInInterface()
	},
	playRandomSong: function(){
		let newIndex
		do {
			newIndex = Math.floor(Math.random()*this.songs.length)
		}while (newIndex===this.currentIndex)
		// nếu newindex=this.currentindex thì dừng lại
		this.currentIndex= newIndex
		this.LoadSongInInterface() 
		
	},
	ScrollToActiveSong : function(){
		setTimeout(function(){
			$('.song.active').scrollIntoView({
				behavior:'smooth',
				block:'center'
			})
		},300)
	},
	//xử lý khi load lại trang nút random và repeat k bị thay đổi
	LoadConfig: function(){
		this.isRandom = this.config.isRandom
		this.isRepeat = this.config.isRepeat

	},
	LoadSongInInterface:function(){
		heading.textContent = this.currentSong.name
		cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
		audio.src = this.currentSong.path
		headingSon.textContent = this.currentSong.singer		
	},

	start: function(){
		// định nghĩa các thuộc tính
		this.defineProperties()
		// xử lý sự kiện
		this.HandleEvent()
		//load thông tin bài hát khi chạy
		this.LoadSongInInterface()
		// render lại
		this.reder()
		// hiển thị giao diện âm nhạc và profile
		this.HOME()
		//gán cấu hình
		this.LoadConfig()
		random.classList.toggle('active', this.isRandom)
		repeat.classList.toggle('active', this.isRepeat)
	},
}
app.start()