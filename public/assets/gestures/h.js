import { Finger, FingerCurl, FingerDirection } from '../FingerDescription';
import GestureDescription from '../GestureDescription';
export const hDescription = new GestureDescription('h'); 
hDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1);
hDescription.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1);
hDescription.addCurl(Finger.Index, FingerCurl.NoCurl, 1);
hDescription.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1);
hDescription.addCurl(Finger.Middle, FingerCurl.NoCurl, 1);
hDescription.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 1);
hDescription.addCurl(Finger.Ring, FingerCurl.FullCurl, 1);
hDescription.addDirection(Finger.Ring, FingerDirection.HorizontalRight, 1);
hDescription.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1);
hDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalRight, 1);
hDescription.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1);
hDescription.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1);
hDescription.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 1);
hDescription.addDirection(Finger.Ring, FingerDirection.HorizontalLeft, 1);
hDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 1);
export default hDescription;