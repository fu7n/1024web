// 可以在此添加交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 修复模态框问题
    fixModalIssues();
    
    // 示例：平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 获取打字元素
    const typedText = document.querySelector('.typed-text');
    
    // 强制重置动画
    function resetAnimation() {
        if (typedText) {
            // 移除动画
            typedText.style.animation = 'none';
            // 触发重绘
            void typedText.offsetWidth;
            // 重新应用动画
            typedText.style.animation = '';
        }
    }

    // 页面加载时执行
    resetAnimation();
    
    // 监听页面可见性变化（应对浏览器缓存）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            resetAnimation();
        }
    });

    // 修改后的动画控制
    const initTyping = () => {
        const container = document.querySelector('.hero-section .lead');
        const textContent = "开启未来科技之门——专业编程教育机构——培养21世纪核心技能";
        
        // 预计算字符间隔
        const charInterval = 5000 / textContent.length; 
        
        // 添加加载状态提示
        container.innerHTML = '<span class="typed-text" style="opacity:0.5">加载中...</span>';
        
        // 延迟1秒等待资源加载
        setTimeout(() => {
            container.innerHTML = '<span class="typed-text"></span>';
            const typedText = container.querySelector('.typed-text');
            
            // 分步动画实现
            let charIndex = 0;
            
            function typeCharacter() {
                if (charIndex < textContent.length) {
                    typedText.textContent += textContent.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeCharacter, charInterval); // 精确计算间隔
                } else {
                    setTimeout(resetTyping, 7000); // 严格保持7秒停留
                }
            }
            
            function resetTyping() {
                typedText.style.animation = 'none';
                typedText.textContent = '';
                charIndex = 0;
                void typedText.offsetWidth; // 触发重绘
                typedText.style.animation = '';
                typeCharacter();
            }
            
            typeCharacter();
        }, 1000);
    }

    // 初始化并添加重试机制
    let retryCount = 0;
    const initWithRetry = () => {
        try {
            initTyping();
        } catch (e) {
            if (retryCount < 3) {
                retryCount++;
                setTimeout(initWithRetry, 500);
            }
        }
    }
    
    initWithRetry();
});

// 增强滚动监听
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // 向下滚动隐藏导航栏
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;

    // 滚动状态样式
    if (currentScroll > 50) {
        navbar.classList.add('scrolled-nav');
    } else {
        navbar.classList.remove('scrolled-nav');
    }
});

// 轮播图高度动态调整
function adjustCarouselHeight() {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const carousel = document.querySelector('.main-carousel');
    carousel.style.height = `calc(100vh - ${navbarHeight}px)`;
}

window.addEventListener('resize', adjustCarouselHeight);
adjustCarouselHeight(); // 初始化 

// 修复模态框问题的函数
function fixModalIssues() {
    // 完全移除模态框背景
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* 完全移除modal-backdrop */
        .modal-backdrop {
            display: none !important;
            opacity: 0 !important;
            background: none !important;
            pointer-events: none !important;
        }
        
        /* 提高模态框的层级 */
        .modal {
            z-index: 9060 !important;
            background: none !important;
        }
        
        .modal-content {
            z-index: 9061 !important;
            position: relative;
            background-color: #fff !important;
            border: 1px solid rgba(0,0,0,.2) !important;
            border-radius: 0.3rem !important;
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,.5) !important;
            pointer-events: auto !important;
        }
        
        .modal-dialog {
            z-index: 9061 !important;
            position: relative;
            pointer-events: auto !important;
        }
        
        /* 确保模态框内所有元素可交互 */
        .modal * {
            pointer-events: auto !important;
        }
        
        /* 禁用所有粒子背景的事件捕获 */
        #particles-js, 
        canvas.particles-js-canvas-el {
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(styleEl);
    
    // 移除所有现有的modal-backdrop
    function removeAllBackdrops() {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(function(backdrop) {
            backdrop.remove();
        });
    }
    
    // 页面加载后立即执行一次
    removeAllBackdrops();
    
    // 定期检查并移除可能出现的backdrop
    setInterval(removeAllBackdrops, 500);
    
    // 监听模态框打开事件
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('show.bs.modal', function() {
            // 确保模态框在最上层
            this.style.zIndex = '9060';
            
            // 移除所有backdrop
            setTimeout(removeAllBackdrops, 10);
        });
        
        // 模态框显示后再次检查
        modal.addEventListener('shown.bs.modal', function() {
            removeAllBackdrops();
        });
    });
    
    // 修复模态框关闭后的问题
    document.addEventListener('hidden.bs.modal', function() {
        removeAllBackdrops();
        
        // 修复body样式
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, true);
} 