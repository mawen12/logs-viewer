import { fn } from '@storybook/test';
import Button from '.';

const meta = {
    title: "components/button",
    component: Button,
    args: {
        variant: 'info',
        title: 'Alert',
    }
}

export default meta;

export const Default = {
    args: {
        title: "默认",
        variant: "info",
    }
}

export const Success = {
    args: {
        title: "成功",
        variant: "success",
    }
}

export const Error = {
    args: {
        title: "错误",
        variant: "error",
    }
}

export const Warning = {
    args: {
        title: "警告",
        variant: "warning",
    }
}