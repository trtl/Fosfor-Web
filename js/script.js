
/* Single Overlay Page Transition with Converging Energy Effect */
(function(){
    const overlay = document.getElementById('page-transition');
    if(!overlay) return;

    function animateOutOnLoad(){
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        });
    }

    // Single overlay converging animation
    function navigateTo(href){
        const tl = gsap.timeline({
            onComplete: () => {
                window.location.href = href;
            }
        });

        tl.to(overlay, {
            opacity: 0.8,
            duration: 0.25,
            ease: 'power1.in'
        }, 0);

        tl.to(overlay, {
            background: 'radial-gradient(circle at center, rgba(44, 206, 33, 1) 0%, rgba(44, 206, 33, 0.7) 35%, rgba(44, 206, 33, 0.4) 70%, rgba(7, 6, 8, 0.5) 100%)',
            duration: 0.2
        }, 0.25);

        tl.to(overlay, {
            opacity: 1,
            background: 'radial-gradient(circle at center, rgba(44, 206, 33, 1) 0%, rgba(44, 206, 33, 0.85) 40%, rgba(44, 206, 33, 0.5) 75%, rgba(7, 6, 8, 0.7) 100%)',
            filter: 'blur(1px)',
            duration: 0.05
        }, 0.45);

        tl.to(overlay, {
            opacity: 0,
            filter: 'blur(0px)',
            duration: 0.25,
            ease: 'power2.inOut'
        }, 0.5);
    }


    // Intercept internal link clicks
    document.addEventListener('click', function(e){
        const link = e.target.closest('a');
        if(!link) return;

        const href = link.getAttribute('href');
        if(!href) return;

        if(link.hostname && link.hostname !== window.location.hostname) return;

        if(href.startsWith('#')) return;

        if(e.ctrlKey || e.metaKey || e.shiftKey) return;

        if(e.button === 1) return;

        // Prevent default and animate
        e.preventDefault();
        navigateTo(href);
    });

    // Run animation on load
    animateOutOnLoad();
})();


/* Nav toggle initializer moved out of inline HTML into this file. */
(function(){
    const toggle = document.getElementById('terminal-toggle');
    const nav = document.querySelector('nav');
    if(!toggle || !nav) return;

    // Only enable the nav toggle behaviour on small screens
    const mq = window.matchMedia('(max-width: 768px)');
    let observer = null;
    let boundToggle = null;

    function setState(minimized){
        if(minimized){
            gsap.to(nav, { height: 48, duration: 0.5, ease: 'power2.inOut' });
            toggle.textContent = 'Open Terminal';
            toggle.setAttribute('aria-pressed', 'true');
            document.body.classList.add('nav-minimized');
        } else {
            gsap.to(nav, { height: 200, duration: 0.5, ease: 'power2.inOut' });
            toggle.textContent = 'Close Terminal';
            toggle.setAttribute('aria-pressed', 'false');
            document.body.classList.remove('nav-minimized');
        }
    }

    function toggleNav(){
        const isMin = nav.classList.toggle('minimized');
        setState(isMin);
    }

    function enableToggle(){
        if(boundToggle) return;
        boundToggle = toggleNav.bind(null);
        toggle.addEventListener('click', boundToggle);

        try{
            const saved = localStorage.getItem('navMinimized');
            if(saved === '1') setState(true);
        }catch(e){}

        observer = new MutationObserver(()=>{ try{ localStorage.setItem('navMinimized', nav.classList.contains('minimized') ? '1' : '0'); }catch(e){} });
        observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
    }

    function disableToggle(){
        if(boundToggle){
            toggle.removeEventListener('click', boundToggle);
            boundToggle = null;
        }
        if(observer){ observer.disconnect(); observer = null; }
        // Ensure nav is expanded on larger screens
        nav.classList.remove('minimized');
        document.body.classList.remove('nav-minimized');
        // restore nav sizing immediately
        gsap.set(nav, { height: 'auto' });
    }

    function handleMQChange(e){
        if(e.matches){ enableToggle(); } else { disableToggle(); }
    }

    // Initialize according to current viewport
    handleMQChange(mq);
    mq.addEventListener('change', handleMQChange);
})();

/* Mouse-responsive gradient intensity for sidebar gradients */
(function(){
    const leftGradient = document.querySelector('.left-gradient');
    const rightGradient = document.querySelector('.right-gradient');
    
    if(!leftGradient || !rightGradient) return;
    
    // Base colors
    const leftBaseColor = 'rgba(44, 206, 33, 0.77)';
    const rightBaseColor = 'rgba(44, 206, 33, 0.77)';
    
    // Store base opacity values
    let leftOpacity = 0.77;
    let rightOpacity = 0.77;
    
    document.addEventListener('mousemove', function(e){
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const leftGradientWidth = windowWidth * 0.04;
        const distToLeft = Math.min(mouseX, leftGradientWidth);
        const leftIntensity = 1 - (distToLeft / leftGradientWidth) * 0.3; // Intensity from 0.7 to 1.0
        
        const rightGradientWidth = windowWidth * 0.04;
        const distToRight = Math.min(windowWidth - mouseX, rightGradientWidth);
        const rightIntensity = 1 - (distToRight / rightGradientWidth) * 0.3; // Intensity from 0.7 to 1.0
        
        const yFactor = mouseY / windowHeight;
        
        // Animate left gradient
        gsap.to(leftGradient, {
            opacity: leftIntensity * 0.77,
            duration: 0.3,
            overwrite: 'auto'
        });
        
        const leftColor = `rgba(44, 206, 33, ${leftIntensity * 0.77})`;
        leftGradient.style.background = `linear-gradient(90deg, ${leftColor} 0%, rgba(7, 6, 8, ${leftIntensity * 0.5}) 100%)`;
        
        // Animate right gradient
        gsap.to(rightGradient, {
            opacity: rightIntensity * 0.77,
            duration: 0.3,
            overwrite: 'auto'
        });
        
        const rightColor = `rgba(44, 206, 33, ${rightIntensity * 0.77})`;
        rightGradient.style.background = `linear-gradient(270deg, ${rightColor} 0%, rgba(7, 6, 8, ${rightIntensity * 0.5}) 100%)`;
    });
    
    // Reset gradients when mouse leaves window
    document.addEventListener('mouseleave', function(){
        gsap.to(leftGradient, {
            opacity: 0.77,
            duration: 0.5
        });
        
        gsap.to(rightGradient, {
            opacity: 0.77,
            duration: 0.5
        });
        
        leftGradient.style.background = 'linear-gradient(90deg, rgba(44, 206, 33, 0.77) 0%, rgba(87, 199, 133, 1) 45%, rgba(255, 255, 255, 0.5) 100%)';
        rightGradient.style.background = 'linear-gradient(270deg, rgba(44, 206, 33, 0.77) 0%, rgba(7, 6, 8, 0.5) 100%)';
    });
})();

/* Typing effect */
(function(){
    const headers = document.querySelectorAll('.box-frame h2');
    if(!headers.length) return;

    function typeInto(el, text, speed=40){
        el.innerHTML = '';
        const typed = document.createElement('span');
        typed.className = 'typed-text';
        el.appendChild(typed);

        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        cursor.textContent = '|';
        el.appendChild(cursor);

        let i = 0;
        function step(){
            if(i < text.length){
                typed.textContent += text.charAt(i);
                i++;
                const jitter = Math.random() * (speed * 0.6);
                setTimeout(step, speed + jitter);
            }
        }
        step();
    }

    headers.forEach((h, idx) => {
        const raw = (h.textContent || '').trim();
        const clean = raw.replace(/\|$/, '').trim();
        h.textContent = '';
        setTimeout(() => typeInto(h, clean, 40), idx * 700);
    });
})();