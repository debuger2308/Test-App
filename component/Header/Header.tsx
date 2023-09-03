"use client"
import { usePathname } from "next/navigation"
import Link from "next/link";
import "./Header.css"

import type { Session } from '@supabase/auth-helpers-nextjs'







const Header = ({ session }: { session: Session | null }) => {



    const pathname = usePathname()
    return (
        <header>
            <div className="container">
                <div className="header">
                    <Link href={"/"} className="header__logo">MCPlatform</Link>
                    <nav className="header__nav">
                        <Link href={"/general"} className={pathname === "/general"
                            ? "header__nav-link--active header__nav-link"
                            : "header__nav-link"}>General Feed</Link>
                        <Link href={"/author"} className={pathname === "/author"
                            ? "header__nav-link--active header__nav-link"
                            : "header__nav-link"}>Author Feed</Link>
                    </nav>


                    <aside className="header__aside">
                        {session
                            ? <>
                                <Link
                                    className={pathname === "/account"
                                        ? "header__aside-profile-link--active header__aside-profile-link"
                                        : "header__aside-profile-link"}
                                    href="/account">My Profile</Link>
                            </>
                            : <>
                                <Link href={"/auth/login"}
                                    className={pathname === "/auth/login"
                                        ? "header__aside-link header__aside-link--active header__aside-log header__aside-log--active"
                                        : "header__aside-link header__aside-log"}
                                >Log <span className={pathname === "/auth/login" && "link-color" || ""}>In</span>
                                </Link>

                                <span className={
                                    pathname === "/auth/login" || pathname === "/auth/signup"
                                        ? "header__aside-span header__aside-span--active"
                                        : "header__aside-span"}>
                                </span>

                                <Link href={"/auth/signup"}
                                    className={pathname === "/auth/signup"
                                        ? "header__aside-link header__aside-link--active header__aside-sign header__aside-sign--active"
                                        : "header__aside-link header__aside-sign"}
                                >Sign <span className={
                                    pathname === "/auth/signup" && "link-color" || ""}>Up</span>
                                </Link>
                            </>
                        }
                    </aside>
                </div>
            </div>
        </header>
    );
}

export default Header;

