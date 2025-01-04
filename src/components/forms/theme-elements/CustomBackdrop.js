import { Backdrop, CircularProgress } from "@mui/material"
import { Box } from "@mui/system";
import { createPortal } from "react-dom"



const rippleKeyframes = {
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(0)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(4)',
            opacity: 0,
        },
    },
    '@keyframes scale': {
        '0%': {
            transform: 'scale(0.8)',
        },
        '50%': {
            transform: 'scale(1.2)',
        },
        '100%': {
            transform: 'scale(0.8)',
        },
    },
    '@keyframes shine': {
        '0%': {
            transform: 'translateX(-100%)',
        },
        '100%': {
            transform: 'translateX(100%)',
        },
    }
};


export default function CustomBackdrop({ loading }) {
    return (
        createPortal(
            <Backdrop
                sx={{
                    color: 'blue',
                    zIndex: 9999,

                }}
                open={loading}

            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...rippleKeyframes,
                        '@keyframes scale': {
                            '0%': {
                                transform: 'scale(0.8)',
                            },
                            '50%': {
                                transform: 'scale(1.2)',
                            },
                            '100%': {
                                transform: 'scale(0.8)',
                            },
                        },
                        '& > div': {
                            position: 'absolute',
                            width: '40px',
                            height: '40px',
                            transform: 'scale(0)',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '50%',
                            zIndex: 1,
                        },
                        '& > div:nth-of-type(1)': {
                            animation: 'ripple 2s infinite',
                        },
                        '& > div:nth-of-type(2)': {
                            animation: 'ripple 2s infinite 0.5s',
                        },
                        '& > div:nth-of-type(3)': {
                            animation: 'ripple 2s infinite 1s',
                        },
                    }}
                >
                    <div className=""></div>
                    <div></div>
                    <div></div>
                    <svg style={{
                        animation: 'scale 2s infinite ease-in-out',
                    }}
                        className="relative z-20"
                        viewBox="0 0 139 95"
                        version="1.1"
                        height="50">
                        <defs>
                            <linearGradient
                                x1="100%"
                                y1="10.5120544%"
                                x2="50%"
                                y2="89.4879456%"
                                id="linearGradient-1"
                            >
                                <stop stopColor="#000000" offset="0%"></stop>
                                <stop stopColor="#FFFFFF" offset="100%"></stop>
                            </linearGradient>
                            <linearGradient
                                x1="64.0437835%"
                                y1="46.3276743%"
                                x2="37.373316%"
                                y2="100%"
                                id="linearGradient-2"
                            >
                                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
                                <stop stopColor="#FFFFFF" offset="100%"></stop>
                            </linearGradient>
                        </defs>
                        <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                        >
                            <g id="Artboard" transform="translate(-400.000000, -178.000000)">
                                <g id="Group" transform="translate(400.000000, 178.000000)">
                                    <path
                                        d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                                        id="Path"
                                        className="text-primary"
                                        style={{ fill: "#10A945" }}
                                    ></path>
                                    <path
                                        d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                                        id="Path"
                                        fill="url(#linearGradient-1)"
                                        opacity="0.2"
                                    ></path>
                                    <polygon
                                        id="Path-2"
                                        fill="#000000"
                                        opacity="0.049999997"
                                        points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                                    ></polygon>
                                    <polygon
                                        id="Path-2"
                                        fill="#000000"
                                        opacity="0.099999994"
                                        points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                                    ></polygon>
                                    <polygon
                                        id="Path-3"
                                        fill="url(#linearGradient-2)"
                                        opacity="0.099999994"
                                        points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                                    ></polygon>
                                </g>
                            </g>
                        </g>
                    </svg>
                </Box>

            </Backdrop >,
            document.body
        ))
}

