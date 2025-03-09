document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('dvd-logo');
    const container = document.getElementById('container');
    
    // 声明全局变量，以便在resize事件中访问
    let containerWidth, containerHeight, logoWidth, logoHeight;
    let posX, posY, speedX, speedY;
    let animationStarted = false;
    
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
            animate();
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
    
    // 使用requestAnimationFrame实现平滑动画
    function animate() {
        // 更新位置
        posX += speedX;
        posY += speedY;
        
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
    
    // 更新Logo位置的辅助函数
    function updatePosition(x, y, speedX) {
        logo.style.left = x + 'px';
        logo.style.top = y + 'px';
        
        // 根据X方向速度设置水平镜像
        // 当speedX > 0（向右移动）时，应用水平镜像
        if (speedX > 0) {
            logo.style.transform = 'scaleX(-1)';
        } else {
            logo.style.transform = 'scaleX(1)';
        }
    }
    
    // 处理窗口大小变化
    window.addEventListener('resize', function() {
        // 只更新容器尺寸，不重新初始化动画
        updateContainerDimensions();
    });
});