"use client"
import { useEffect, useRef, ReactNode, useState } from "react";
import { useIsPresentationTool } from "next-sanity/hooks";
import { useIsDraftMode } from "@/components/DraftModeProvider";

type AnimatedOnViewProps = {
  children: ReactNode;
  className?: string;
};

function isAboveViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom < 0;
}

export default function AnimateOnView({ children, className }: AnimatedOnViewProps) {
    const animateRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [hasAnimateChildren, setHasAnimateChildren] = useState(false);
    const hasAnimatedRef = useRef(false);
    const timeOut = 80;

    const isPresentationTool = useIsPresentationTool();
    const isDraftMode = useIsDraftMode();
    const disableAnimations = isPresentationTool || isDraftMode;

    const markAnimated = () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        setHasAnimated(true);
    };

    const handleAnimationEnd = (event: Event) => {
        const target = event.target as HTMLElement;
        target.classList.remove('in-view', 'animate', 'animate-container');
        markAnimated();
    };

    useEffect(() => {
        const element = animateRef.current;
        if (!element) return;
        setHasAnimateChildren(element.querySelectorAll('.animate').length > 0);
    }, []);

    useEffect(() => {
        if (!disableAnimations) return;

        const element = animateRef.current;
        if (!element) return;

        element.classList.remove('in-view', 'animate', 'animate-container');
        element.querySelectorAll<HTMLElement>('.animate').forEach((el) => {
            el.classList.remove('in-view', 'animate');
        });
        markAnimated();
    }, [disableAnimations]);

    useEffect(() => {
        if (disableAnimations) return;
        if (hasAnimatedRef.current) return;

        const element = animateRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const target = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        const animatedElements = target.querySelectorAll<HTMLElement>('.animate');
                        if (animatedElements.length === 0) {
                            target.classList.add('in-view');
                            target.addEventListener('animationend', handleAnimationEnd);
                        } else {
                            animatedElements.forEach((el, index) => {
                                setTimeout(() => {
                                    el.classList.add('in-view');
                                    el.addEventListener('animationend', handleAnimationEnd);
                                }, timeOut * index);
                            });
                        }
                        observer.unobserve(target);
                    } else if (isAboveViewport(target)) {

                        const animatedElements = target.querySelectorAll<HTMLElement>('.animate');
                        target.classList.remove('in-view', 'animate', 'animate-container');
                        animatedElements.forEach((el) => {
                            el.classList.remove('in-view', 'animate');
                        });
                        markAnimated();
                        observer.unobserve(target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: "0px 0px -10% 0px",
            }
        );

        const observeTimer = setTimeout(() => {
            observer.observe(element);
        }, 150);

        return () => {
            clearTimeout(observeTimer);
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={animateRef}
            className={`${className ?? ''} ${(hasAnimated || disableAnimations || hasAnimateChildren) ? '' : 'animate-container'}`}
        >
            {children}
        </div>
    );
}
