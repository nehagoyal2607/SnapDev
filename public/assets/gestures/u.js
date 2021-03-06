import { Finger, FingerCurl, FingerDirection } from '../FingerDescription';
import GestureDescription from '../GestureDescription';
export const uDescription = new GestureDescription('u'); 
uDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1);
uDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1);
uDescription.addCurl(Finger.Index, FingerCurl.NoCurl, 1);
uDescription.addDirection(Finger.Index, FingerDirection.VerticalUp, 1);
uDescription.addCurl(Finger.Middle, FingerCurl.NoCurl, 1);
uDescription.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1);
uDescription.addCurl(Finger.Ring, FingerCurl.FullCurl, 1);
uDescription.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1);
uDescription.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1);
uDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1);
uDescription.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1);
uDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1);
uDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1);
export default uDescription;