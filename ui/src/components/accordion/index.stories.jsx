import Accordion from ".";
import { fn } from '@storybook/test';

const meta = {
    title: "components/accordion",
    component: Accordion,
    args: {
        defaultExapned: false,
        title: 'Accordion',
        onChange: fn(),
    }
}

export default meta;

export const Default = {
    args: {
        title: "默认",
        onChange: (state) => console.log('changed to', state),
    }
}

export const Open = {
    args: {
        defaultExapned: true,
        title: "已打开",
        onChange: (state) => console.log('changed to', state),
    }
}