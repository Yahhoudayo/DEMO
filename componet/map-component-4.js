class MapComponent4 extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const locationData = {
      '駐車場': {
        image: 'images/pins/a.webp',
        detail: '一般の方専用の駐車場です。ご自由にご利用ください。'
      },
      '高志会館': {
        image: 'images/pins/b.webp',
        detail: '展示をしています。'
      },
      '第一体育館(3M、4M、5M)': { // data-nameと一致させる
        image: 'images/pins/gym1.webp',
        detail: '様々なイベントを行っております。<br>9:00~9:10 開会式<br>9:10~9:50 ストリートダンス(午前の部)<br>10:30~11:30 芸人のお笑いライブ<br>11:30~12:00 校友会によるお菓子投げ<br>13:20~14:00 ストリートダンス(午後の部)<br>14:15~14:45 フィジークイベント<br>15:00~15:30 吹奏楽部演奏<br>15:30~16:30 有志イベント(ボイスパフォーマンス、ダンス、お菓子投げ)<br>16:30~18:30 抽選会'
      },
      '第二体育館': {
        image: 'images/pins/gym2.webp',
        detail: '部活動の出し物が販売されています。'
      },
      '情報棟': {
        image: 'images/pins/information_tou.webp',
        detail: 'プログラミング研究部体験'
      },
      '電気棟': {
        image: 'images/pins/electry_tou.webp',
        detail: '主に電気コースの教室・研究室があります。'
      },
      '管理棟': {
        image: 'images/pins/information_tou.webp',
        detail: '1年生の教室や学生課があります。'
      },
      '講義棟': {
        image: 'images/pins/information_tou.webp',
        detail: '機械コースや情報コースの教室、中講義室などがあります。'
      },
      '建設・化学棟': {
        image: 'images/pins/information_tou.webp',
        detail: '主に建設コースや化学コースの教室・研究室があります。'
      },
      '専攻科棟': {
        image: 'images/pins/information_tou.webp',
        detail: 'プログラミング研究部体験'
      },
      '創造テクノセンター': {
        image: 'images/pins/information_tou.webp',
        detail: '情報処理演習室などがあります。'
      },
      '創造技術ファクトリー': {
        image: 'images/pins/information_tou.webp',
        detail: '機械コースの実習で使われたりします。'
      },
      '学生集会所': {
        image: 'images/pins/information_tou.webp',
        detail: '吹奏楽部の部室などに利用されます。'
      },
      '図書館棟': {
        image: 'images/pins/library.webp',
        detail: '9:30~15:30 悠久交友会ブース<br>ビブリオバトル'
      },
      '機械棟': {
        image: 'images/pins/information_tou.webp',
        detail: '主に機械コースの教室・研究室があります。'
      }
    };
    // locationDataに存在しないピン名や、data-nameとlocationDataのキーが一致しない場合、
    // モーダルが表示されません。'第一体育館(3M、4M、5M)'のようにdata-nameとキーを一致させました。

    shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 90%; 
                    max-width: 1000px; 
                    aspect-ratio: 4905 / 3042;
                    margin: 10px auto; /* ページの余白を少し減らす */
                    margin: 20px auto;
                    border: 1px solid #ccc;
                    background-color: #fafafa;
                    overflow: hidden;
                    touch-action: none; 
                }
                
                svg { 
                    width: 100%; 
                    height: 100%; 
                    display: block;
                    transition: viewBox 0.6s ease-out; /* トランジションを長くしました */
                }
                
                svg.no-transition {
                    transition: none; 
                }
                
                .cg-pin-wrap {
                    cursor: pointer;
                    outline: none;
                    transition: transform 0.3s ease-out;
                }
                
                .cg-pin-wrap:hover, 
                .cg-pin-wrap:focus {
                    filter: brightness(1.2);
                }

                @keyframes pulse {
                    0%, 100% { 
                        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); 
                    }
                    50% { 
                        filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1)); 
                    }
                }
                
                .cg-pin-wrap.highlight {
                    animation: pulse 2s ease-in-out infinite;
                }

                #modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 1000;
                    justify-content: center;
                    align-items: center;
                }

                #modal-overlay.active {
                    display: flex;
                }

                #modal-box {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    padding: 30px;
                    max-width: 60vw;
                    max-height: 90vh;
                    width: 100%;
                    position: relative;
                    animation: slideIn 0.3s ease-out;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                @keyframes slideIn {
                    from {
                        transform: translateY(-30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                #close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #666;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    z-index: 1001;
                }

                #close-btn:hover {
                    color: #000;
                }

                #modal-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                    margin-top: 10px;
                }

                #modal-image {
                    max-width: 100%;
                    max-height: 60vh;
                    object-fit: contain;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    background: #e0e0e0;
                }

                #modal-detail {
                    font-size: 16px;
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
            </style>



    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="6541" zoomAndPan="magnify" viewBox="0 -100 4905.75 3042.749987" height="4057" preserveAspectRatio="xMidYMid meet" version="1.0" id="svgRoot">
        <g id="map-shapes"></g>


        <g class="cg-pin-wrap" transform="translate(2240,75) scale(3.0)" data-name="駐車場" data-base-x="2240" data-base-y="75" data-map-id="parking1" tabindex="0">
            <image href="images/pins/p.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2240,300) scale(3.0)" data-name="高志会館" data-base-x="2240" data-base-y="300" data-map-id="koushi-kaikan" tabindex="0">
            <image href="images/pins/1-1.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2740,300) scale(3.0)" data-name="駐車場" data-base-x="2740" data-base-y="300" data-map-id="parking2" tabindex="0">
            <image href="images/pins/p.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(3040,700) scale(3.0)" data-name="図書館棟" data-base-x="3040" data-base-y="700" data-map-id="library" tabindex="0">
            <image href="images/pins/1-3.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(3550,500) scale(3.0)" data-name="学生集会所" data-base-x="3550" data-base-y="500" data-map-id="gakusei-shukaijo" tabindex="0">
            <image href="images/pins/1-2.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(3520,730) scale(3.0)" data-name="第二体育館" data-base-x="3520" data-base-y="730" data-map-id="gym2" tabindex="0">
            <image href="images/pins/1-4.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(3410,1060) scale(3.0)" data-name="第一体育館(3M、4M、5M)" data-base-x="3410" data-base-y="1060" data-map-id="gym1" tabindex="0">
            <image href="images/pins/1-5.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2950,1000) scale(3.0)" data-name="創造技術ファクトリー" data-base-x="2950" data-base-y="1000" data-map-id="factory" tabindex="0">
            <image href="images/pins/1-6.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2460,780) scale(3.0)" data-name="電気棟" data-base-x="2460" data-base-y="780" data-map-id="electric-building" tabindex="0">
            <image href="images/pins/1-7.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(1840,890) scale(3.0)" data-name="管理棟" data-base-x="1840" data-base-y="890" data-map-id="management-building" tabindex="0">
            <image href="images/pins/1-8.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(1800,1060) scale(3.0)" data-name="講義棟" data-base-x="1800" data-base-y="1060" data-map-id="lecture-building" tabindex="0">
            <image href="images/pins/1-9.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2360,1060) scale(3.0)" data-name="機械棟" data-base-x="2360" data-base-y="1060" data-map-id="machine-building" tabindex="0">
            <image href="images/pins/1-10.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2000,1270) scale(3.0)" data-name="建設・化学棟" data-base-x="2000" data-base-y="1270" data-map-id="civil-chemistry-building" tabindex="0">
            <image href="images/pins/1-11.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2400,1270) scale(3.0)" data-name="情報棟" data-base-x="2400" data-base-y="1270" data-map-id="info-building" tabindex="0">
            <image href="images/pins/1-12.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2150,1440) scale(3.0)" data-name="専攻科棟" data-base-x="2150" data-base-y="1440" data-map-id="advanced-course-building" tabindex="0">
            <image href="images/pins/1-13.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2400,1440) scale(3.0)" data-name="創造テクノセンター" data-base-x="2400" data-base-y="1440" data-map-id="tech-center" tabindex="0">
            <image href="images/pins/1-14.webp" width="110" height="110" x="-30" y="-30" />
        </g>

        <g class="cg-pin-wrap" transform="translate(2050,1970) scale(3.0)" data-name="駐車場" data-base-x="2050" data-base-y="1970" data-map-id="parking3" tabindex="0">
            <image href="images/pins/p.webp" width="110" height="110" x="-30" y="-30" />
        </g>


            </svg>

            <div id="modal-overlay">
                <div id="modal-box">
                    <button id="close-btn">×</button>
                    <h2 id="modal-title"></h2>
                    <img id="modal-image" alt="location image" />
                    <p id="modal-detail"></p>
                </div>
            </div>
        `;

    const svg = shadow.querySelector('#svgRoot');
    const overlay = shadow.querySelector('#modal-overlay');
    const closeBtn = shadow.querySelector('#close-btn');
    const modalTitle = shadow.querySelector('#modal-title');
    const modalImage = shadow.querySelector('#modal-image');
    const modalDetail = shadow.querySelector('#modal-detail');
    const pins = shadow.querySelectorAll('.cg-pin-wrap');

    function showModal(name) {
      const data = locationData[name] || {
        image: '',
        detail: '詳細情報がありません。'
      };

      modalTitle.textContent = name;
      modalDetail.innerHTML = data.detail;

      if (data.image) {
        modalImage.src = data.image;
        modalImage.style.display = 'block';
        modalImage.onerror = () => {
          modalImage.style.display = 'none';
        };
      } else {
        modalImage.style.display = 'none';
      }

      overlay.classList.add('active');
    }

    function hideModal() {
      overlay.classList.remove('active');
    }

    // ====== ズーム・パン機能の変数をconstructor内に移動 (元の位置) ======
    // 現在のViewBoxを保持
    let currentViewBox = [0, -100, 4905.75, 3042.749987]; // [minX, minY, width, height]

    function updateViewBox(newViewBox) {
      currentViewBox = newViewBox;
      svg.setAttribute('viewBox', `${newViewBox[0]} ${newViewBox[1]} ${newViewBox[2]} ${newViewBox[3]}`);
    }
    // ===================================================================

    // ====== マップ定数定義 (追加) ======
    const defaultMinY = -100;
    const defaultWidth = 4905.75;
    const defaultHeight = 3042.749987;
    const mapMaxY = defaultHeight + defaultMinY; // マップコンテンツの最大Y座標 (2942.749987)
    // =============================


    // ========== ピンのイベントリスナー (修正) ==========
    pins.forEach((pin) => {
      pin.addEventListener('click', (event) => {
        event.stopPropagation();

        // ピンの座標を取得
        let pinX = parseFloat(pin.getAttribute('data-base-x'));
        let pinY = parseFloat(pin.getAttribute('data-base-y'));

        if (isNaN(pinX) || isNaN(pinY)) {
          const match = pin.getAttribute('transform').match(/translate\(([^,]+),([^)]+)\)/);
          if (match) {
            pinX = parseFloat(match[1]);
            pinY = parseFloat(match[2]);
          } else {
            console.warn('ピン座標を取得できません:', pin);
            return;
          }
        }

        // ズームインするビューポートサイズ (元のマップサイズの約1/3〜1/4程度に設定)
        const TARGET_VIEW_WIDTH = 1200;
        const TARGET_VIEW_HEIGHT = 800;

        // SVG全体のサイズ
        // ローカル変数の定義を削除し、コンストラクタスコープの定数を使用
        // const svgWidth = 4905.75;
        // const svgHeight = 3042.749987;


        // ピンを中心にして、新しいViewBoxの左上座標を計算
        let newMinX = pinX - TARGET_VIEW_WIDTH / 2;
        let newMinY = pinY - TARGET_VIEW_HEIGHT / 2;

        // 境界内に収める (マップの端で途切れないようにする)
        newMinX = Math.max(0, newMinX);
        newMinX = Math.min(newMinX, defaultWidth - TARGET_VIEW_WIDTH);

        // Y座標の境界を適用 (最小は -100, 最大はマップの下端に合うように)
        const maxNewMinY = mapMaxY - TARGET_VIEW_HEIGHT;
        newMinY = Math.max(defaultMinY, newMinY);
        newMinY = Math.min(newMinY, maxNewMinY);

        /* 元のコード (削除またはコメントアウト):
        // SVGのviewBoxのY座標は0から始まるため、0未満にはならないようにする
        newMinY = Math.max(0, newMinY);
        // マップの下端で途切れないようにする
        newMinY = Math.min(newMinY, svgHeight - TARGET_VIEW_HEIGHT);

        // 元のviewBoxが0 -100 4905.75 3042.749987なので、Yの最小を-100に合わせる
        newMinY = Math.max(-100, newMinY);
        newMinY = Math.min(newMinY, svgHeight - TARGET_VIEW_HEIGHT);
        */


        // マップの移動とズームを適用
        svg.classList.remove('no-transition');
        updateViewBox([newMinX, newMinY, TARGET_VIEW_WIDTH, TARGET_VIEW_HEIGHT]);

        // ピンをバウンドアニメーション (クラスメソッドを呼び出す)
        this.startBounceAnimation(pin, 1200);

        // アニメーション終了後にモーダルを表示
        setTimeout(() => {
          const name = pin.getAttribute('data-name');
          showModal(name);
        }, 600); // viewBoxのtransition時間(0.6s)に合わせて短縮
      });

      // Enterキーまたはスペースキーで選択
      pin.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pin.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
    });


    closeBtn.addEventListener('click', hideModal);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideModal();
      }
    });

    // URL パラメータから map_id を取得してハイライト (修正: viewBoxを全体表示に戻す)
    const urlParams = new URLSearchParams(window.location.search);
    const mapId = urlParams.get('map_id');

    if (mapId) {
      const targetPins = Array.from(pins).filter(pin =>
        pin.getAttribute('data-map-id') === mapId
      );

      if (targetPins.length > 0) {
        // ハイライト時は全体を表示するViewBoxに戻す
        updateViewBox([0, defaultMinY, defaultWidth, defaultHeight]);
        svg.classList.add('no-transition'); // 初期表示はトランジションなしで

        targetPins.forEach(targetPin => {
          // ハイライト効果のみを適用
          targetPin.classList.add('highlight');

          // transformの変更はバウンドアニメーションで制御すべきなので、ここでは無効化
          // const newTransform = `translate(${newX},${newY}) scale(4.0)`;
          // targetPin.setAttribute('transform', newTransform);
        });
      }
    }


    // マウスホイールでのズーム (元のロジック)
    // ... (変更なし、機能確認済み) ...
    svg.addEventListener('wheel', (e) => {
      e.preventDefault();

      const zoomFactor = 0.1;
      const isZoomIn = e.deltaY < 0;

      let [minX, minY, width, height] = currentViewBox;

      const svgRect = svg.getBoundingClientRect();
      const mouseX = (e.clientX - svgRect.left) / svgRect.width;
      const mouseY = (e.clientY - svgRect.top) / svgRect.height;

      const cursorX = minX + mouseX * width;
      const cursorY = minY + mouseY * height;

      let newWidth, newHeight;

      if (isZoomIn) {
        newWidth = width * (1 - zoomFactor);
        newHeight = height * (1 - zoomFactor);
      } else {
        newWidth = width * (1 + zoomFactor);
        newHeight = height * (1 + zoomFactor);
      }

      let newMinX = cursorX - (mouseX * newWidth);
      let newMinY = cursorY - (mouseY * newHeight);

      // ローカル変数の定義は残すが、コンストラクタスコープの定数を使用
      // const defaultWidth = 4905.75; // 既にスコープに存在
      // const defaultHeight = 3042.749987; // 既にスコープに存在
      const minViewSize = 500;

      // ズームアウトしすぎないように制限
      if (newWidth > defaultWidth || newHeight > defaultHeight) {
        newWidth = defaultWidth;
        newHeight = defaultHeight;
        newMinX = 0;
        newMinY = defaultMinY;
      }

      // ズームインしすぎないように制限
      if (newWidth < minViewSize) newWidth = minViewSize;
      if (newHeight < minViewSize) newHeight = minViewSize;

      // 境界チェックを適用 (Y座標の下限を-100に、上限をマップの端に合わせるように修正)
      newMinX = Math.max(0, Math.min(newMinX, defaultWidth - newWidth));
      const maxNewMinY = mapMaxY - newHeight;
      newMinY = Math.max(defaultMinY, Math.min(newMinY, maxNewMinY));

      /* 元のコード (削除またはコメントアウト):
      newMinY = Math.max(-100, Math.min(newMinY, defaultHeight - newHeight));
      */

      updateViewBox([newMinX, newMinY, newWidth, newHeight]);
    });

    // ====== タッチ操作の実装 (元のロジック) ======
    // ... (変更なし) ...
    let touchStartDistance = 0;
    let touchStartViewBox = null;
    let touchStartCenter = null;
    let isDragging = false;
    let dragStartPoint = null;
    let dragStartViewBox = null;
    let lastTapTime = 0;

    function getTouchDistance(touch1, touch2) {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getTouchCenter(touch1, touch2) {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
    }

    function screenToSVGCoords(screenX, screenY) {
      const svgRect = svg.getBoundingClientRect();
      const relX = (screenX - svgRect.left) / svgRect.width;
      const relY = (screenY - svgRect.top) / svgRect.height;

      const [minX, minY, width, height] = currentViewBox;
      return {
        x: minX + relX * width,
        y: minY + relY * height
      };
    }

    svg.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        // ピンチズーム開始
        e.preventDefault();
        touchStartDistance = getTouchDistance(e.touches[0], e.touches[1]);
        touchStartViewBox = [...currentViewBox];
        touchStartCenter = getTouchCenter(e.touches[0], e.touches[1]);
        isDragging = false;
        svg.classList.add('no-transition');
      } else if (e.touches.length === 1) {
        // ドラッグ開始 or ダブルタップ判定
        const currentTime = Date.now();
        const tapGap = currentTime - lastTapTime;

        if (tapGap < 300 && tapGap > 0) {
          // ダブルタップ検出
          e.preventDefault();
          const touch = e.touches[0];
          const center = screenToSVGCoords(touch.clientX, touch.clientY);

          let [minX, minY, width, height] = currentViewBox;
          const newWidth = width * 0.5;
          const newHeight = height * 0.5;

          let newMinX = center.x - newWidth / 2;
          let newMinY = center.y - newHeight / 2;

          // const defaultWidth = 4905.75; // 既にスコープに存在
          // const defaultHeight = 3042.749987; // 既にスコープに存在

          // 境界チェック (Y座標の下限を-100に、上限をマップの端に合わせるように修正)
          newMinX = Math.max(0, Math.min(newMinX, defaultWidth - newWidth));
          const maxNewMinY = mapMaxY - newHeight;
          newMinY = Math.max(defaultMinY, Math.min(newMinY, maxNewMinY));

          /* 元のコード (削除またはコメントアウト):
          newMinY = Math.max(-100, Math.min(newMinY, defaultHeight - newHeight));
          */


          svg.classList.remove('no-transition');
          updateViewBox([newMinX, newMinY, newWidth, newHeight]);
          lastTapTime = 0;
        } else {
          // シングルタップ（ドラッグの準備）
          lastTapTime = currentTime;
          isDragging = true;
          dragStartPoint = screenToSVGCoords(e.touches[0].clientX, e.touches[0].clientY);
          dragStartViewBox = [...currentViewBox];
          svg.classList.add('no-transition');
        }
      }
    });

    svg.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && touchStartDistance) {
        // ピンチズーム中
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
        const currentCenter = getTouchCenter(e.touches[0], e.touches[1]);

        const scale = touchStartDistance / currentDistance;
        const [startMinX, startMinY, startWidth, startHeight] = touchStartViewBox;

        let newWidth = startWidth * scale;
        let newHeight = startHeight * scale;

        // ズーム限界チェック
        const minZoom = 500;
        const maxZoom = 12500;
        // const defaultWidth = 4905.75; // 既にスコープに存在
        // const defaultHeight = 3042.749987; // 既にスコープに存在

        if (newWidth < minZoom) newWidth = minZoom;
        if (newHeight < minZoom) newHeight = minZoom;
        if (newWidth > maxZoom) newWidth = maxZoom;
        if (newHeight > maxZoom) newHeight = maxZoom;

        // ズーム中心を維持
        const svgCenter = screenToSVGCoords(touchStartCenter.x, touchStartCenter.y);
        const centerDx = currentCenter.x - touchStartCenter.x;
        const centerDy = currentCenter.y - touchStartCenter.y;

        const svgRect = svg.getBoundingClientRect();
        const panX = (centerDx / svgRect.width) * newWidth;
        const panY = (centerDy / svgRect.height) * newHeight;

        let newMinX = svgCenter.x - (svgCenter.x - startMinX) * (newWidth / startWidth) - panX;
        let newMinY = svgCenter.y - (svgCenter.y - startMinY) * (newHeight / startHeight) - panY;

        // 境界チェック (Y座標の下限を-100に、上限をマップの端に合わせるように修正)
        newMinX = Math.max(0, Math.min(newMinX, defaultWidth - newWidth));
        const maxNewMinY = mapMaxY - newHeight;
        newMinY = Math.max(defaultMinY, Math.min(newMinY, maxNewMinY));

        /* 元のコード (削除またはコメントアウト):
          newMinY = Math.max(-100, Math.min(newMinY, defaultHeight - newHeight));
        */

        updateViewBox([newMinX, newMinY, newWidth, newHeight]);
      } else if (e.touches.length === 1 && isDragging && dragStartPoint) {
        // ドラッグ中
        e.preventDefault();
        const currentPoint = screenToSVGCoords(e.touches[0].clientX, e.touches[0].clientY);

        const dx = dragStartPoint.x - currentPoint.x;
        const dy = dragStartPoint.y - currentPoint.y;

        const [startMinX, startMinY, width, height] = dragStartViewBox;
        let newMinX = startMinX + dx;
        let newMinY = startMinY + dy;

        // const defaultWidth = 4905.75; // 既にスコープに存在
        // const defaultHeight = 3042.749987; // 既にスコープに存在

        // 境界チェック (Y座標の下限を-100に、上限をマップの端に合わせるように修正)
        newMinX = Math.max(0, Math.min(newMinX, defaultWidth - width));
        const maxNewMinY = mapMaxY - height;
        newMinY = Math.max(defaultMinY, Math.min(newMinY, maxNewMinY));

        /* 元のコード (削除またはコメントアウト):
          newMinY = Math.max(-100, Math.min(newMinY, defaultHeight - height));
        */


        updateViewBox([newMinX, newMinY, width, height]);
      }
    });

    svg.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        touchStartDistance = 0;
        touchStartViewBox = null;
        touchStartCenter = null;
        isDragging = false;
        dragStartPoint = null;
        dragStartViewBox = null;
        svg.classList.remove('no-transition');
      }
    });

    svg.addEventListener('touchcancel', (e) => {
      touchStartDistance = 0;
      touchStartViewBox = null;
      touchStartCenter = null;
      isDragging = false;
      dragStartPoint = null;
      dragStartViewBox = null;
      svg.classList.remove('no-transition');
    });
  }

  // ========== startBounceAnimation メソッドをクラス内で定義 (修正) ==========
  // このメソッドは、this.startBounceAnimation()として呼び出す必要があります。
  startBounceAnimation(pin, duration = 1200) {
    const currentTransform = pin.getAttribute('transform');
    // transform属性がない場合は処理を中断
    if (!currentTransform) return;

    // translate(x, y)とscale(s)の値を取得
    const match = currentTransform.match(/translate\(([^,]+),([^)]+)\)\s*scale\(([^)]+)\)/);

    // transform属性がないか形式が異なる場合は処理を中断
    if (!match) return;

    const baseX = parseFloat(match[1]);
    const baseY = parseFloat(match[2]);
    const scale = parseFloat(match[3]);

    const start = performance.now();

    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      // バウンスアニメーションの計算ロジック
      const bounces = 3;
      const easing = (1 - progress); // 減衰
      const offsetNorm = Math.abs(Math.sin(Math.PI * progress * bounces));

      // 最大オフセットを決定 (scale値に基づいて調整。元の値 * 2.5程度)
      const maxOffset = scale * 25;
      const offset = -maxOffset * offsetNorm * easing; // 上方向へバウンド (マイナス)

      // 新しいY座標を計算
      const newY = baseY + offset;

      // transform属性を更新（X座標とScaleは維持）
      pin.setAttribute('transform', `translate(${baseX},${newY}) scale(${scale})`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // アニメーション終了後、元のY座標に戻す
        pin.setAttribute('transform', `translate(${baseX},${baseY}) scale(${scale})`);
      }
    };

    requestAnimationFrame(animate);
  }
  // ===================================================================

}

customElements.define('map-component-4', MapComponent4);