'use client'

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { Route } from "next";


export default function LinkComponent({
    href,
    page,
    linkType,
    children,
    inNewTab = false,
    className = "",
    onClickAction
}: Link) {

    const pathname = usePathname();
    const router = useRouter();
    const [linkPath, setLinkPath] = useState<string>("");
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async function pageTransition(hrefString: string) {
        const overlay = document.getElementById("page-loader");
        const body = document.body;
        const header = document.querySelector("header");

        overlay?.classList.add("visible");
        header?.classList.add("no-touch");
        body.classList.add("loading");

        await sleep(300); // Pause for 300ms
        router.push(hrefString as Route);
    }

    useEffect(() => {
        if (linkType === "page" && page) {
            if (page._type === "page") {
                setLinkPath(`/${page.slug}`);
            } else if (page._type === "home") {
                setLinkPath(`/`);
            }
        }
    }, [pathname, linkType, page]);


    const handleClick = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, 
        href: string | URL | undefined
    ) => {

        if (!href) return; 
        const hrefString = href.toString();

        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
            return;
        }

        if (pathname === hrefString) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

         if (onClickAction) {
            onClickAction(e);
        }

        e.preventDefault();

        // PAGE TRANSITION FUNCTION
        pageTransition(hrefString);
       
    };

    const handleAnchorClick = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        anchor: string
    ) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
            return;
        }

        e.preventDefault();

        if (onClickAction) {
            onClickAction(e);
        }

        const id = anchor.split("#")[1];

        if (pathname === "/") {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        // Navigate home with the hash so the page transition runs and
        // the target section is scrolled into view after landing.
        pageTransition(anchor);
    };

    if (linkType === "href" && !href?.includes("#")) {
        return (
            <a
                href={href}
                target={inNewTab ? "_blank" : "_self"}
                rel={inNewTab ? "noopener noreferrer" : undefined}
                className={`${className}`}
            >
                {children}
            </a>
        ); 
    } else if (linkType === "href" && href?.includes("#")) {
        const anchor = `/#${href.split("#")[1]}`;
        return (
            <Link
                href={anchor}
                className={`${className}`}
                onClick={(e) => handleAnchorClick(e, anchor)}
                target={inNewTab ? "_blank" : "_self"}
                rel={inNewTab ? "noopener noreferrer" : undefined}
            >
                {children}
            </Link>
        );
    } else if (linkType === "page") {
        return (
            <Link
                href={{
                    pathname: linkPath
                }}
                className={`${className}`}
                onClick={(e) => handleClick(e, linkPath)}
                target={inNewTab ? "_blank" : "_self"}
                rel={inNewTab ? "noopener noreferrer" : undefined}
            >
                {children}
            </Link>
        );
    }

    return null;
}

