// Tipos mínimos para el template Avalon
import type { ReactNode, MutableRefObject, Dispatch, SetStateAction } from 'react';

export type ColorScheme = 'light' | 'dark' | 'dim';

export type Demo = any;
export type Page = any;
export type NodeRef = any;
export type CustomEvent = any;
export type ChartDataState = any;
export type ChartOptionsState = any;

export interface ChildContainerProps {
	children: ReactNode;
}

export interface LayoutConfig {
	ripple: boolean; // nombre usado en el template como 'ripple'
	inputStyle: 'outlined' | 'filled';
	menuMode: 'static' | 'overlay' | 'slim' | 'slim-plus' | 'horizontal' | 'reveal' | 'drawer';
	colorScheme: ColorScheme;
	componentTheme: string;
	scale: number;
	menuTheme: string;
	topbarTheme: string;
	menuProfilePosition: 'start' | 'end';
	desktopMenuActive?: boolean;
	mobileMenuActive?: boolean;
	mobileTopbarActive?: boolean;
}

export interface LayoutState {
	staticMenuDesktopInactive: boolean;
	overlayMenuActive: boolean;
	configSidebarVisible: boolean;
	profileSidebarVisible: boolean;
	staticMenuMobileActive: boolean;
	menuHoverActive: boolean;
	rightMenuActive: boolean;
	topbarMenuActive: boolean;
	sidebarActive: boolean;
	anchored: boolean;
	overlaySubmenuActive: boolean;
	menuProfileActive: boolean;
	resetMenu: boolean;
}

export interface BreadcrumbItem {
	label?: string;
	to?: string;
}
export type Breadcrumb = BreadcrumbItem[];

export interface LayoutContextProps {
	layoutConfig: LayoutConfig;
	setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
	layoutState: LayoutState;
	setLayoutState: Dispatch<SetStateAction<LayoutState>>;
	onMenuToggle: () => void;
	isSlim: () => boolean;
	isSlimPlus: () => boolean;
	isHorizontal: () => boolean;
	isDesktop: () => boolean;
	isSidebarActive: () => boolean;
	breadcrumbs: Breadcrumb;
	setBreadcrumbs: Dispatch<SetStateAction<Breadcrumb>>;
	onMenuProfileToggle: () => void;
	onTopbarMenuToggle: () => void;
	showRightSidebar: () => void;
}

export interface AppTopbarRef {
	menubutton?: HTMLButtonElement | null;
}

export interface MenuModel {
	label?: string;
	icon?: string;
	to?: string;
	url?: string;
	target?: string;
	items?: MenuModel[];
}

export interface MenuProps {
	model: MenuModel[];
}

export interface AppMenuItemProps {
	item: MenuModel;
	index: number;
	root?: boolean;
}

export interface AppConfigProps {
	minimal?: boolean;
}

export interface UseSubmenuOverlayPositionProps {
	trigger: MutableRefObject<HTMLElement | null>;
	target: MutableRefObject<HTMLElement | null>;
} 