import { borderColorVariants, borderRaduisVariants, colorVariants } from '../../helpers/enum';
export interface FileUploadProps {
    label: string;
    borderColor?: (typeof borderColorVariants)[keyof typeof borderColorVariants];
    textColor?: (typeof colorVariants)[keyof typeof colorVariants];
    borderRaduis?: (typeof borderRaduisVariants)[keyof typeof borderRaduisVariants];
}