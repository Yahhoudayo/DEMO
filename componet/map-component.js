/**
 * MapComponent:
 * 外部ファイル (JSON, SVG) からデータを非同期に読み込み、地図とピンを表示し、
 * クリックイベントとURLパラメータによるハイライト・ズーム機能を提供します。
 */
class MapComponent extends HTMLElement {
  // 外部ファイルのパスを定義
  static LOCATION_DATA_PATH = 'data/map-data.json';
  static SVG_MAP_PATH = 'images/maps/map1.svg';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.locationData = {}; // JSONから読み込んだ場所データを格納

    // テンプレート構造の初期化 (CSSとモーダル構造)
    this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #fafafa;
                }
                
                svg { 
                    width: 90%; 
                    max-width: 1000px; 
                    border: 1px solid #ccc;
                    display: block;
                    margin: 20px auto;
                    height: auto;
                    /* SVG全体に対するスムーズなアニメーションを有効化 */
                    transition: transform 0.5s ease-out; 
                }
                
                .cg-pin-wrap {
                    cursor: pointer;
                    outline: none;
                    /* ピンの拡大/縮小のトランジションを有効化 */
                    transition: transform 0.3s ease-out; 
                }
                
                .cg-pin-wrap:hover, 
                .cg-pin-wrap:focus {
                    filter: brightness(1.2);
                }

                /* ハイライト用アニメーションの定義 */
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

                /* --- モーダルCSS（変更なし） --- */
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

                #modal-overlay.active { display: flex; }

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
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
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

                #close-btn:hover { color: #000; }

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

            <div id="map-container">
                </div>

            <div id="modal-overlay">
                <div id="modal-box">
                    <button id="close-btn">×</button>
                    <h2 id="modal-title"></h2>
                    <img id="modal-image" alt="location image" />
                    <p id="modal-detail"></p>
                </div>
            </div>
        `;

    // モーダル関連DOM要素の取得
    this.overlay = this.shadow.querySelector('#modal-overlay');
    this.closeBtn = this.shadow.querySelector('#close-btn');
    this.modalTitle = this.shadow.querySelector('#modal-title');
    this.modalImage = this.shadow.querySelector('#modal-image');
    this.modalDetail = this.shadow.querySelector('#modal-detail');

    // モーダルイベントリスナーの設定
    this.bindModalEvents();
  }

  /**
   * JSONとSVGを非同期で読み込み、DOMを構築する
   */
  async connectedCallback() {
    try {
      // 1. JSONデータのロード
      const dataResponse = await fetch(MapComponent.LOCATION_DATA_PATH);
      const data = await dataResponse.json();
      this.locationData = data.locations;

      // 2. SVGマップのロード
      const svgResponse = await fetch(MapComponent.SVG_MAP_PATH);
      const svgText = await svgResponse.text();

      // 3. SVGをDOMに挿入
      const mapContainer = this.shadow.querySelector('#map-container');
      mapContainer.innerHTML = svgText;
      this.svg = this.shadow.querySelector('#svgRoot');
      const pinsContainer = this.shadow.querySelector('#pins-container');

      if (!pinsContainer) {
        console.error('SVGファイルにID "pins-container" が見つかりません。');
        return;
      }

      // 4. ピン要素を生成してSVGに挿入
      const pinElements = this.createPins(data.pins);
      pinsContainer.innerHTML = pinElements;

      // 5. 挿入されたピン要素を取得し、イベントリスナーを設定
      this.pins = this.shadow.querySelectorAll('.cg-pin-wrap');
      this.bindPinEvents();

      // 6. URLパラメータに基づくハイライト処理を実行
      this.highlightFromURL();

    } catch (error) {
      console.error('地図コンポーネントの初期化に失敗しました:', error);
    }
  }

  /**
   * JSONデータからSVGのピン要素のHTML文字列を生成する
   * @param {Array} pinData - JSONのpins配列
   * @returns {string} - 生成されたSVGグループ要素のHTML文字列
   */
  createPins(pinData) {
    // SVGの元のピンのスケール値（固定）
    const PIN_SCALE = 3.0;

    return pinData.map(pin => {
      // pin.size が存在し、数値であることを確認。
      const size = pin.size || 350; // サイズがない場合はデフォルト値を使用

      // 🎯 修正箇所：画像を中央に配置するためのオフセット計算
      // x_offset: 画像を水平方向に中央に配置 (サイズの半分)
      const x_offset = size / 2;

      // y_offset: 画像を垂直方向に中央に配置 (サイズの半分)
      // ピンの中心を (pin.x, pin.y) に合わせる
      const y_offset = size / 2;

      return `
      <g class="cg-pin-wrap" 
         transform="translate(${pin.x},${pin.y}) scale(${PIN_SCALE})" 
         data-name="${pin.name}" 
         data-map-id="${pin.mapId}" 
         data-base-x="${pin.x}" 
         data-base-y="${pin.y}" 
         data-pin-size="${size}"
         tabindex="0">
        <image href="${pin.img}" width="${size}" height="${size}" x="-${x_offset}" y="-${y_offset}" />
      </g>
    `;
    }).join('');
  }








  /**
   * モーダルを表示する (元のコードのロジックを踏襲)
   * @param {string} name - 表示する場所の名前
   */
  showModal(name) {
    const data = this.locationData[name] || {
      image: '',
      detail: '詳細情報がありません。'
    };

    this.modalTitle.textContent = name;
    this.modalDetail.innerHTML = data.detail;

    if (data.image) {
      this.modalImage.src = data.image;
      this.modalImage.style.display = 'block';
      this.modalImage.onerror = () => {
        this.modalImage.style.display = 'none';
      };
    } else {
      this.modalImage.style.display = 'none';
    }

    this.overlay.classList.add('active');
  }

  /**
   * モーダルを非表示にする
   */
  hideModal() {
    this.overlay.classList.remove('active');
  }

  /**
   * モーダル関連のイベントリスナーを設定する
   */
  bindModalEvents() {
    this.closeBtn.addEventListener('click', () => this.hideModal());

    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) {
        this.hideModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.hideModal();
      }
    });
  }

  /**
   * ピン（地図上のマーカー）のイベントリスナーを設定する
   */
  bindPinEvents() {
    this.pins.forEach((pin) => {
      // クリックイベント
      pin.addEventListener('click', (event) => {
        event.stopPropagation();
        const name = pin.getAttribute('data-name');
        this.showModal(name);
      });

      // キーボード操作のサポート (Enter/Space)
      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pin.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
    });
  }

  /**
   * URLパラメータに基づいてピンをハイライトし、ズームする
   */
  highlightFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const mapId = urlParams.get('map_id');

    if (!mapId) return;

    // map-idが一致する全てのピンを取得
    const targetPins = Array.from(this.pins).filter(pin =>
      pin.getAttribute('data-map-id') === mapId
    );

    if (targetPins.length === 0) return;

    targetPins.forEach(targetPin => {
      // 1. ハイライト用クラスとアニメーションを適用
      // 元のコードでは style.animation で指定されていましたが、可読性向上のため .highlight クラスとしてCSSで定義するのが一般的です。
      // ただし、元のコードのロジックに従い style.animation で適用します。
      targetPin.style.animation = 'pulse 2s ease-in-out infinite';

      // 2. ズームイン表示（ピンのみ拡大）
      const baseX = parseFloat(targetPin.getAttribute('data-base-x'));
      const baseY = parseFloat(targetPin.getAttribute('data-base-y'));

      // 元のコードの transform 変更ロジックを再現
      const newScale = 4.0; // 3.0 -> 4.0 に拡大
      const newX = baseX - 100;
      const newY = baseY - 250;

      const newTransform = `translate(${newX},${newY}) scale(${newScale})`;
      targetPin.setAttribute('transform', newTransform);
    });

    // 3. SVG全体を指定のピンにフォーカス（スクロール）
    setTimeout(() => {
      const firstPin = targetPins[0];
      // scrollIntoView を使用してビューポートの中心に持ってくる
      firstPin.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}

customElements.define('map-component', MapComponent);