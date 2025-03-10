document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('dvd-logo');
    const container = document.getElementById('container');
    
    // 声明全局变量，以便在resize事件中访问
    let containerWidth, containerHeight, logoWidth, logoHeight;
    let posX, posY, speedX, speedY;
    let animationStarted = false;
    let lastFrameTime = null; // 用于基于时间的动画
    
    // 创建transformState对象跟踪变换状态，避免不必要的DOM更新
    const transformState = {
        scaleX: 1 // 初始值
    };
    
    // 等待图像加载完成，以获取正确的尺寸
    logo.onload = function() {
        initDVDAnimation();
    };
    
    // 如果图像已经缓存，可能不会触发onload事件
    if (logo.complete) {
        initDVDAnimation();
    }
    
    function initDVDAnimation() {
        // 获取容器和Logo的尺寸
        updateContainerDimensions();
        
        // 只有在动画尚未开始时才初始化位置和速度
        if (!animationStarted) {
            // 随机初始位置（确保完全在容器内）
            posX = Math.random() * (containerWidth - logoWidth);
            posY = Math.random() * (containerHeight - logoHeight);
            
            // 随机初始速度和方向
            speedX = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1); // 1-3像素/帧
            speedY = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1); // 1-3像素/帧
            
            // 设置初始位置
            updatePosition(posX, posY, speedX);
            
            // 启动动画
            requestAnimationFrame(animate);
            animationStarted = true;
        }
    }
    
    // 更新容器和Logo尺寸的函数
    function updateContainerDimensions() {
        containerWidth = container.clientWidth;
        containerHeight = container.clientHeight;
        logoWidth = logo.clientWidth;
        logoHeight = logo.clientHeight;
        
        // 确保DVD图标不会超出新的容器边界
        if (posX + logoWidth > containerWidth) {
            posX = containerWidth - logoWidth;
        }
        if (posY + logoHeight > containerHeight) {
            posY = containerHeight - logoHeight;
        }
    }
    
    // 使用requestAnimationFrame实现平滑动画，基于时间的动画
    function animate(currentTime) {
        // 确保currentTime有值，防止首次调用时出现问题
        if (currentTime === undefined) {
            requestAnimationFrame(animate);
            return;
        }
        
        // 计算帧间隔时间，实现更平滑的动画
        if (!lastFrameTime) lastFrameTime = currentTime;
        const deltaTime = currentTime - lastFrameTime || 16.67; // 如果计算结果为0，使用默认的60fps帧率(约16.67ms)
        lastFrameTime = currentTime;
        
        // 基于时间的位置更新，使动画速度在不同帧率下保持一致
        // 使用系数0.06来调整速度，使其与原始速度相近
        const timeScale = deltaTime * 0.06;
        posX += speedX * timeScale;
        posY += speedY * timeScale;
        
        // 检测碰撞 - 水平方向
        if (posX <= 0) {
            posX = 0;
            speedX = -speedX; // 反转水平方向
        } else if (posX + logoWidth >= containerWidth) {
            posX = containerWidth - logoWidth;
            speedX = -speedX; // 反转水平方向
        }
        
        // 检测碰撞 - 垂直方向
        if (posY <= 0) {
            posY = 0;
            speedY = -speedY; // 反转垂直方向
        } else if (posY + logoHeight >= containerHeight) {
            posY = containerHeight - logoHeight;
            speedY = -speedY; // 反转垂直方向
        }
        
        // 更新Logo位置
        updatePosition(posX, posY, speedX);
        
        // 继续动画循环
        requestAnimationFrame(animate);
    }
    
    // 更新Logo位置的辅助函数 - 使用transform代替left/top，启用GPU加速
    function updatePosition(x, y, speedX) {
        // 根据X方向速度设置水平镜像
        const newScaleX = speedX > 0 ? -1 : 1;
        
        // 只有当transform状态变化时才更新
        if (transformState.scaleX !== newScaleX) {
            transformState.scaleX = newScaleX;
        }
        
        // 使用translate3d触发GPU加速，并合并所有transform属性
        logo.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${transformState.scaleX})`;
    }
    
    // 处理窗口大小变化
    window.addEventListener('resize', function() {
        // 只更新容器尺寸，不重新初始化动画
        updateContainerDimensions();
    });
});