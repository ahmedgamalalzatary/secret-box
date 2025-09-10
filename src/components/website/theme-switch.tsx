'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/store'
import { setTheme } from '@/store/slices/appSlice'
import { Moon, Sun } from 'lucide-react'

export function ThemeSwitch() {
    const { theme, setTheme: setNextTheme } = useTheme()
    const dispatch = useAppDispatch()
    const { theme: reduxTheme } = useAppSelector((state) => state.app)

    const currentTheme = reduxTheme === 'system' ? theme : reduxTheme

    React.useEffect(() => {
        if (theme && theme !== reduxTheme) {
            dispatch(setTheme(theme as 'light' | 'dark' | 'system'))
        }
    }, [theme, reduxTheme, dispatch])

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        dispatch(setTheme(newTheme))
        setNextTheme(newTheme)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 px-0 border border-gray-200 dark:border-gray-700">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => handleThemeChange('light')}
                    className={currentTheme === 'light' ? 'text-primary' : ''}
                >
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleThemeChange('dark')}
                    className={currentTheme === 'dark' ? 'text-primary' : ''}
                >
                    Dark
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleThemeChange('system')}
                    className={currentTheme === 'system' ? 'text-primary' : ''}
                >
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
