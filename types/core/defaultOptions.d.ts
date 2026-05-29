import { CornerType, DotType } from './types';
interface LogoDefaults {
    bgColor: string;
    borderWidth: number;
    crossOrigin: string;
    borderRadius: number;
    logoRadius: number;
}
interface DefaultOptions {
    logo: LogoDefaults;
    width: number;
    download: boolean;
    downloadName: string;
    nodeQrCodeOptions: {
        margin: number;
        color: {
            dark: string;
            light: string;
        };
    };
    dotsOptions: {
        type: DotType;
        color: string;
    };
    cornersOptions: {
        type: CornerType;
        color: string;
    };
}
declare const defaultOptions: DefaultOptions;
export default defaultOptions;
