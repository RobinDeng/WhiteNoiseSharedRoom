import { Behaviour, serializable } from "@needle-tools/engine";

declare type AudioClip = string;

export class fileContainer extends Behaviour{
    @serializable(URL)
    IRSmall:AudioClip|null=null;
    IRMedium:AudioClip|null=null;
    IRLarge:AudioClip|null=null;
}