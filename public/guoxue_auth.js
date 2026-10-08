/**
 * 国学数术与汉唐中医全息工作台 · 统一单点登录与多模块会员中心 SDK
 * (Guoxue Unified Auth & Membership SDK)
 * 
 * 核心特性：
 * 1. 统一 Google 官方登录 (One-Tap 与弹出授权)
 * 2. 跨模块单点登录 (SSO Token 自动透传与鉴权同步)
 * 3. 4 大业务模块独立会员体系 (汉唐经方 / 紫微斗数 / 生辰八字 / 实战风水)
 * 4. 统一会员中心模态面板与一键会员权益体验
 */

(function() {
  if (window.GuoxueAuth) return;

  const AUTH_API_BASE = 'https://fangji-2oh.pages.dev/api';
  const GOOGLE_CLIENT_ID = '1085165795703-9ael2g3bqdo9hr5kf5aam1jk44r5fsg1.apps.googleusercontent.com';
  const STORAGE_TOKEN_KEY = 'guoxue_sso_token';

  // 模块映射与元数据
  const MODULES_CONFIG = {
    'fangji': { key: 'fangji', name: '汉唐经方', icon: '🌿', color: '#10b981', desc: '391首经典方剂速查与智能剂量透视' },
    'ziwei': { key: 'ziwei', name: '紫微斗数', icon: '🔮', color: '#a855f7', desc: '14主星正法起盘与12宫全息四化流年' },
    'bazi': { key: 'bazi', name: '生辰八字', icon: '📜', color: '#00f2fe', desc: '四柱干支大运量化与四库古籍全息引证' },
    'fengshui': { key: 'fengshui', name: '实战风水', icon: '🧭', color: '#f59e0b', desc: '360°真北罗盘立极与九宫飞星空间诊断' }
  };

  // 检测当前所在模块
  function detectCurrentModule() {
    if (window.GUOXUE_CURRENT_MODULE) return window.GUOXUE_CURRENT_MODULE;
    const host = window.location.hostname.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (host.includes('fangji') || path.includes('fangji')) return 'fangji';
    if (host.includes('ziwei') || path.includes('ziwei')) return 'ziwei';
    if (host.includes('bazi') || path.includes('bazi')) return 'bazi';
    if (host.includes('fengshui') || path.includes('fengshui')) return 'fengshui';
    return 'entry'; // 默认统一入口
  }

  const currentModKey = detectCurrentModule();

  // 状态管理
  let authToken = localStorage.getItem(STORAGE_TOKEN_KEY) || localStorage.getItem('fangji_token') || '';
  let currentUser = null;
  let googleInitialized = false;

  // 注入样式
  function injectStyles() {
    if (document.getElementById('guoxue-auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'guoxue-auth-styles';
    style.textContent = `
      .gx-auth-widget {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif;
      }
      .gx-auth-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #f8fafc;
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(8px);
        text-decoration: none;
      }
      .gx-auth-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.35);
        transform: translateY(-1px);
      }
      .gx-btn-back {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #cbd5e1;
        font-size: 12.5px;
      }
      .gx-btn-back:hover {
        background: rgba(255, 255, 255, 0.14);
        color: #38bdf8;
        border-color: rgba(56, 189, 248, 0.4);
      }
      .gx-btn-google {
        background: rgba(255, 255, 255, 0.95);
        color: #1e293b;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      .gx-btn-google:hover {
        background: #ffffff;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
      }
      .gx-user-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(18, 25, 41, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 4px 12px 4px 5px;
        border-radius: 999px;
        cursor: pointer;
        backdrop-filter: blur(12px);
        transition: all 0.2s;
      }
      .gx-user-pill:hover {
        border-color: #00f2fe;
        box-shadow: 0 0 12px rgba(0, 242, 254, 0.2);
      }
      .gx-user-avatar {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        object-fit: cover;
        background: #334155;
      }
      .gx-user-name {
        font-size: 13px;
        font-weight: 600;
        color: #f1f5f9;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .gx-badge-vip {
        font-size: 10.5px;
        padding: 2px 7px;
        border-radius: 999px;
        font-weight: 700;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
        box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
      }
      .gx-badge-free {
        font-size: 10.5px;
        padding: 2px 6px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        color: #94a3b8;
      }

      /* 会员中心模态窗 */
      .gx-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(3, 7, 18, 0.78);
        backdrop-filter: blur(10px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .gx-modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .gx-modal-card {
        background: #0d1322;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        width: 100%;
        max-width: 580px;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.75);
        overflow: hidden;
        transform: scale(0.96);
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        color: #f8fafc;
      }
      .gx-modal-overlay.open .gx-modal-card {
        transform: scale(1);
      }
      .gx-modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.02);
      }
      .gx-modal-title {
        font-size: 17px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .gx-modal-close {
        background: rgba(255, 255, 255, 0.06);
        border: none;
        color: #94a3b8;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s;
      }
      .gx-modal-close:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
      }
      .gx-modal-body {
        padding: 24px;
        max-height: 75vh;
        overflow-y: auto;
      }
      .gx-user-profile-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 14px;
        margin-bottom: 20px;
      }
      .gx-profile-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .gx-profile-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 2px solid rgba(0, 242, 254, 0.4);
      }
      .gx-profile-text h4 {
        font-size: 15px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 2px;
      }
      .gx-profile-text p {
        font-size: 12px;
        color: #94a3b8;
      }
      .gx-logout-btn {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
        padding: 5px 12px;
        border-radius: 8px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .gx-logout-btn:hover {
        background: rgba(239, 68, 68, 0.22);
      }

      /* 模块会员卡列表 */
      .gx-mod-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .gx-mod-card {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: border-color 0.2s;
      }
      .gx-mod-card:hover {
        border-color: rgba(255, 255, 255, 0.18);
      }
      .gx-mod-left {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .gx-mod-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        background: rgba(255, 255, 255, 0.05);
      }
      .gx-mod-info h5 {
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .gx-mod-info p {
        font-size: 11.5px;
        color: #94a3b8;
        margin-top: 2px;
      }
      .gx-mod-action-btn {
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .gx-btn-activate {
        background: linear-gradient(135deg, #00f2fe, #4facfe);
        color: #030712;
      }
      .gx-btn-activate:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
      }
      .gx-btn-renew {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #cbd5e1;
      }
      .gx-btn-renew:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .gx-notice-box {
        margin-top: 18px;
        padding: 12px 14px;
        background: rgba(0, 242, 254, 0.05);
        border: 1px dashed rgba(0, 242, 254, 0.25);
        border-radius: 10px;
        font-size: 12px;
        color: #94a3b8;
        line-height: 1.6;
      }
      .gx-toast {
        position: fixed;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 10px 22px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        z-index: 100000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: gxFadeIn .2s ease-out;
      }
      @keyframes gxFadeIn { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
    `;
    document.head.appendChild(style);
  }

  // Toast 提示
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'gx-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.remove(); }, 2800);
  }

  // 检查 URL 中的 sso_token
  function checkUrlSsoToken() {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('sso_token');
    if (ssoToken) {
      authToken = ssoToken;
      localStorage.setItem(STORAGE_TOKEN_KEY, ssoToken);
      localStorage.setItem('fangji_token', ssoToken);
      // 清除 URL 中的参数
      params.delete('sso_token');
      const newUrl = window.location.pathname + (params.toString() ? ('?' + params.toString()) : '') + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  // 获取当前用户信息
  async function fetchCurrentUser() {
    if (!authToken) {
      currentUser = null;
      renderWidget();
      return null;
    }
    try {
      const res = await fetch(`${AUTH_API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.user) {
          currentUser = data.user;
          renderWidget();
          updateSsoLinks();
          dispatchAuthChange(true);
          return currentUser;
        }
      }
      // token 无效或过期
      authToken = '';
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      currentUser = null;
      renderWidget();
      dispatchAuthChange(false);
      return null;
    } catch (e) {
      console.warn('[GuoxueAuth] fetch me notice:', e);
      return null;
    }
  }

  // 广播登录状态改变事件
  function dispatchAuthChange(isLoggedIn) {
    window.dispatchEvent(new CustomEvent('guoxue_auth_changed', {
      detail: { isLoggedIn, user: currentUser, token: authToken }
    }));
  }

  const isCentralAuthHost = window.location.hostname === 'fangji-2oh.pages.dev' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  let ssoListenerBound = false;

  // 绑定跨窗口 SSO 授权消息监听
  function bindSsoMessageListener() {
    if (ssoListenerBound) return;
    ssoListenerBound = true;
    window.addEventListener('message', async (event) => {
      if (!event.data || event.data.type !== 'GUOXUE_SSO_SUCCESS') return;
      const { token, user } = event.data;
      if (token) {
        authToken = token;
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
        localStorage.setItem('fangji_token', token);
        if (user) {
          currentUser = user;
          renderWidget();
          closeMemberModal();
          updateSsoLinks();
          showToast(`欢迎回来，${currentUser.name || '同修'}！`);
          dispatchAuthChange(true);
        } else {
          await fetchCurrentUser();
          closeMemberModal();
          showToast('登录成功！');
        }
      }
    });
  }

  // 初始化 Google Identity Services (仅在中央鉴权主域初始化，防止跨域 origin_mismatch)
  function initGoogleGsi() {
    if (!isCentralAuthHost) return;
    if (window.google && window.google.accounts && window.google.accounts.id) {
      setupGoogleAccounts();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = setupGoogleAccounts;
    document.head.appendChild(script);
  }

  function setupGoogleAccounts() {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
    googleInitialized = true;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false
    });

    // 隐藏渲染原生按钮以备点击唤醒
    let hiddenWrap = document.getElementById('gx-google-hidden-wrap');
    if (!hiddenWrap) {
      hiddenWrap = document.createElement('div');
      hiddenWrap.id = 'gx-google-hidden-wrap';
      hiddenWrap.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;';
      document.body.appendChild(hiddenWrap);
    }
    try {
      window.google.accounts.id.renderButton(hiddenWrap, {
        type: 'standard',
        shape: 'pill',
        theme: 'outline',
        size: 'large'
      });
    } catch(e){}

    // 若未登录，尝试 One-Tap 提示
    if (!authToken && !sessionStorage.getItem('gx_onetap_dismissed')) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            sessionStorage.setItem('gx_onetap_dismissed', '1');
          }
        });
      } catch(e){}
    }
  }

  // 处理 Google 认证回调
  async function handleGoogleCredential(response) {
    if (!response || !response.credential) return;
    showToast('正在验证 Google 身份...');
    try {
      const res = await fetch(`${AUTH_API_BASE}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (data.ok && data.token && data.user) {
        authToken = data.token;
        localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
        localStorage.setItem('fangji_token', data.token);
        currentUser = data.user;
        renderWidget();
        updateSsoLinks();
        closeMemberModal();
        showToast(`欢迎回来，${currentUser.name || '同修'}！`);
        dispatchAuthChange(true);
      } else {
        showToast(data.message || 'Google 登录失败，请重试');
      }
    } catch (e) {
      console.error('[GuoxueAuth] Google auth error:', e);
      showToast('登录服务连接异常，请重试');
    }
  }

  // 触发 Google 登录 (子域自动弹窗/跳转至 fangji-2oh.pages.dev 免配置 Google 白名单)
  function triggerGoogleLogin() {
    if (isCentralAuthHost) {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        const gBtn = document.querySelector('#gx-google-hidden-wrap div[role=button], #gx-google-hidden-wrap iframe');
        if (gBtn) {
          try { gBtn.click(); return; } catch(e){}
        }
        try {
          window.google.accounts.id.prompt();
        } catch(e){}
      } else {
        showToast('Google 服务加载中，请稍候点击...');
      }
      return;
    }

    // 子域名环境：唤起 fangji-2oh.pages.dev SSO 授权通道
    bindSsoMessageListener();
    const returnUrl = window.location.href;
    const ssoUrl = `https://fangji-2oh.pages.dev/sso-auth.html?return_url=${encodeURIComponent(returnUrl)}`;

    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = ssoUrl;
      return;
    }

    const w = 480;
    const h = 640;
    const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2);
    const popup = window.open(
      ssoUrl,
      'guoxue_sso_window',
      `width=${w},height=${h},top=${top},left=${left},status=no,toolbar=no,menubar=no,location=yes,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // 浏览器若强制拦截弹窗，无缝降级为页面重定向
      window.location.href = ssoUrl;
    } else {
      showToast('正在打开 Google 统一授权窗口...');
    }
  }

  // 退出登录
  async function logout() {
    if (authToken) {
      fetch(`${AUTH_API_BASE}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      }).catch(() => {});
    }
    authToken = '';
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem('fangji_token');
    currentUser = null;
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    renderWidget();
    closeMemberModal();
    updateSsoLinks();
    showToast('已安全退出登录');
    dispatchAuthChange(false);
  }

  // 开通/激活某模块会员
  async function activateModuleVip(modKey, days = 30) {
    if (!authToken) {
      triggerGoogleLogin();
      return;
    }
    try {
      showToast(`正在开通【${MODULES_CONFIG[modKey].name}】会员...`);
      const res = await fetch(`${AUTH_API_BASE}/member/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ module: modKey, days })
      });
      const data = await res.json();
      if (data.ok && data.user) {
        currentUser = data.user;
        renderWidget();
        renderMemberModalBody();
        showToast(data.message || '开通成功！');
        dispatchAuthChange(true);
      } else {
        showToast(data.message || '开通异常，请稍候重试');
      }
    } catch (e) {
      showToast('网络请求失败');
    }
  }

  // 自动将链接附带 sso_token (仅当在统一入口页时)
  function updateSsoLinks() {
    if (!authToken) return;
    const links = document.querySelectorAll('a[href*="pages.dev"], a[href*="github.io"]');
    links.forEach(a => {
      try {
        const u = new URL(a.href, window.location.origin);
        // 如果是四项目标之一，附加 sso_token
        if (u.hostname.includes('pages.dev') || u.hostname.includes('github.io')) {
          u.searchParams.set('sso_token', authToken);
          a.href = u.toString();
        }
      } catch(e){}
    });
  }

  // 渲染挂载的身份状态小组件
  function renderWidget() {
    let mountEl = document.getElementById('guoxue-auth-mount');
    if (!mountEl) {
      // 若页面未指定容器，自动在右上角创建固定悬浮组件
      mountEl = document.getElementById('gx-floating-auth-widget');
      if (!mountEl) {
        mountEl = document.createElement('div');
        mountEl.id = 'gx-floating-auth-widget';
        mountEl.style.cssText = 'position:fixed;top:18px;right:22px;z-index:9999;';
        document.body.appendChild(mountEl);
      }
    }

    // 如果在4大子模块中，添加返回总入口快捷按钮
    let backBtnHtml = '';
    if (currentModKey !== 'entry') {
      backBtnHtml = `
        <a href="https://entry-cap.pages.dev/" class="gx-auth-btn gx-btn-back" title="返回国学全景工作台总入口">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>总入口</span>
        </a>
      `;
    }

    if (currentUser) {
      const avatarSrc = currentUser.picture || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="%2394a3b8"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="%2394a3b8"/></svg>';
      const name = currentUser.name || currentUser.email.split('@')[0];
      
      // 当前模块会员状态
      let curBadgeHtml = '';
      if (currentModKey !== 'entry' && currentUser.memberships && currentUser.memberships[currentModKey]) {
        const modM = currentUser.memberships[currentModKey];
        curBadgeHtml = modM.is_vip 
          ? `<span class="gx-badge-vip">✨ ${modM.badge || 'VIP'}</span>`
          : `<span class="gx-badge-free">免费版</span>`;
      } else {
        // 入口页：统计开通了几个VIP
        const vCount = Object.values(currentUser.memberships || {}).filter(m => m.is_vip).length;
        curBadgeHtml = vCount > 0 
          ? `<span class="gx-badge-vip">${vCount}项VIP</span>`
          : `<span class="gx-badge-free">会员中心</span>`;
      }

      mountEl.innerHTML = `
        <div class="gx-auth-widget">
          ${backBtnHtml}
          <div class="gx-user-pill" id="gx-open-modal-pill" title="查看4大模块会员权益">
            <img src="${avatarSrc}" class="gx-user-avatar" referrerpolicy="no-referrer" alt="Avatar">
            <span class="gx-user-name">${name}</span>
            ${curBadgeHtml}
          </div>
        </div>
      `;
      const pill = mountEl.querySelector('#gx-open-modal-pill');
      if (pill) pill.onclick = openMemberModal;
    } else {
      mountEl.innerHTML = `
        <div class="gx-auth-widget">
          ${backBtnHtml}
          <button type="button" class="gx-auth-btn gx-btn-google" id="gx-login-trigger-btn">
            <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            <span>谷歌一键登录</span>
          </button>
        </div>
      `;
      const btn = mountEl.querySelector('#gx-login-trigger-btn');
      if (btn) btn.onclick = triggerGoogleLogin;
    }
  }

  // 模态弹窗构建
  function createMemberModal() {
    if (document.getElementById('gx-member-modal-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'gx-member-modal-overlay';
    overlay.className = 'gx-modal-overlay';
    overlay.innerHTML = `
      <div class="gx-modal-card">
        <div class="gx-modal-header">
          <div class="gx-modal-title">
            <span>☯️</span> 国学数术与中医全景工作台 · 会员中心
          </div>
          <button type="button" class="gx-modal-close" id="gx-modal-close-btn">&times;</button>
        </div>
        <div class="gx-modal-body" id="gx-modal-body-content">
          <!-- 动态渲染内容 -->
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMemberModal();
    });
    const cBtn = overlay.querySelector('#gx-modal-close-btn');
    if (cBtn) cBtn.onclick = closeMemberModal;
  }

  function renderMemberModalBody() {
    const bodyEl = document.getElementById('gx-modal-body-content');
    if (!bodyEl) return;

    if (!currentUser) {
      bodyEl.innerHTML = `
        <div style="text-align:center;padding:32px 10px;">
          <div style="font-size:42px;margin-bottom:12px;">👤</div>
          <h3 style="font-size:18px;margin-bottom:6px;color:#fff;">登录统一账户</h3>
          <p style="font-size:13px;color:#94a3b8;margin-bottom:24px;">一个 Google 账号通用 4 大工作台，自动同步各模块会员特权。</p>
          <button type="button" class="gx-auth-btn gx-btn-google" id="gx-modal-login-btn" style="padding:10px 24px;font-size:14px;margin:0 auto;">
            <span>使用 Google 账号直接登录</span>
          </button>
        </div>
      `;
      const btn = bodyEl.querySelector('#gx-modal-login-btn');
      if (btn) btn.onclick = triggerGoogleLogin;
      return;
    }

    const memberships = currentUser.memberships || {};
    const avatarSrc = currentUser.picture || '';

    // 生成4个模块的会员状态卡片
    const cardsHtml = Object.keys(MODULES_CONFIG).map(k => {
      const cfg = MODULES_CONFIG[k];
      const m = memberships[k] || { is_vip: false, plan: 'free', vip_until: 0 };
      const isVip = m.is_vip;
      
      let statusTag = isVip
        ? `<span class="gx-badge-vip">✨ VIP会员有效</span>`
        : `<span class="gx-badge-free">免费体验版</span>`;

      let expiryText = '';
      if (isVip && m.vip_until) {
        const d = new Date(m.vip_until);
        expiryText = `<span style="font-size:11px;color:#94a3b8;margin-left:6px;">(至 ${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')})</span>`;
      }

      const actionBtn = isVip
        ? `<button class="gx-mod-action-btn gx-btn-renew" onclick="window.GuoxueAuth.activateMember('${k}', 30)">续期 30 天</button>`
        : `<button class="gx-mod-action-btn gx-btn-activate" onclick="window.GuoxueAuth.activateMember('${k}', 30)">立即开通 VIP</button>`;

      return `
        <div class="gx-mod-card">
          <div class="gx-mod-left">
            <div class="gx-mod-icon" style="background:${cfg.color}15;border:1px solid ${cfg.color}35;">${cfg.icon}</div>
            <div class="gx-mod-info">
              <h5>
                <span>${cfg.name}</span>
                ${statusTag}
                ${expiryText}
              </h5>
              <p>${cfg.desc}</p>
            </div>
          </div>
          <div>
            ${actionBtn}
          </div>
        </div>
      `;
    }).join('');

    bodyEl.innerHTML = `
      <div class="gx-user-profile-bar">
        <div class="gx-profile-info">
          ${avatarSrc ? `<img src="${avatarSrc}" class="gx-profile-avatar" referrerpolicy="no-referrer">` : '<div class="gx-profile-avatar" style="display:flex;align-items:center;justify-content:center;background:#1e293b;font-size:20px;">👤</div>'}
          <div class="gx-profile-text">
            <h4>${currentUser.name || '国学同修'}</h4>
            <p>${currentUser.email}</p>
          </div>
        </div>
        <button type="button" class="gx-logout-btn" id="gx-modal-logout-btn">退出登录</button>
      </div>

      <div style="margin-bottom:12px;font-size:13px;font-weight:700;color:#cbd5e1;display:flex;align-items:center;justify-content:space-between;">
        <span>各功能模块独立会员体系</span>
        <span style="font-size:11.5px;color:#64748b;font-weight:400;">各模块权益独立计费</span>
      </div>

      <div class="gx-mod-grid">
        ${cardsHtml}
      </div>

      <div class="gx-notice-box">
        💡 <strong>会员体系体验说明</strong>：当前会员管理框架已全面贯通数据库，各模块会员权益独立记录与核验。现阶段为功能预览期，点击即可一键免费体验各模块 VIP 专属功能，无需绑定任何真实支付。
      </div>
    `;

    const logoutBtn = bodyEl.querySelector('#gx-modal-logout-btn');
    if (logoutBtn) logoutBtn.onclick = logout;
  }

  function openMemberModal() {
    createMemberModal();
    renderMemberModalBody();
    const overlay = document.getElementById('gx-member-modal-overlay');
    if (overlay) overlay.classList.add('open');
  }

  function closeMemberModal() {
    const overlay = document.getElementById('gx-member-modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  // 初始化入口
  function init() {
    injectStyles();
    checkUrlSsoToken();
    createMemberModal();
    fetchCurrentUser();
    if (isCentralAuthHost) {
      initGoogleGsi();
    } else {
      bindSsoMessageListener();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露公共 API
  window.GuoxueAuth = {
    getUser: () => currentUser,
    getToken: () => authToken,
    isVip: (modKey) => {
      const k = modKey || currentModKey;
      return Boolean(currentUser && currentUser.memberships && currentUser.memberships[k] && currentUser.memberships[k].is_vip);
    },
    openMemberModal,
    closeMemberModal,
    triggerGoogleLogin,
    logout,
    activateMember: activateModuleVip,
    setUser: (u) => {
      currentUser = u;
      renderWidget();
      renderMemberModalBody();
      updateSsoLinks();
    },
    refresh: fetchCurrentUser
  };

})();
