import router, { routerOptions } from ".";

export const useNavigationMenu = () => [
    {
        label: routerOptions[router.home].title,
        value: router.home,
    },
    {
        label: routerOptions[router.overview].title,
        value: router.overview,
    }
]