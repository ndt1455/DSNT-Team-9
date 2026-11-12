import captureCheck from './assets/capture-check.svg';
import sampleId from './assets/sample-id.png';
import sampleSelfie from './assets/sample-selfie.jpg';

export type CaptureSubject = 'front' | 'back' | 'selfie';

export const captureTitles: Record<CaptureSubject, string> = {
  front: 'Front of EID',
  back: 'Back of EID',
  selfie: 'Take a Selfie',
};

export function CapturePreview({ subject, captured }: { subject: CaptureSubject; captured: boolean }) {
  const selfie = subject === 'selfie';
  const description = selfie
    ? 'Position your face in the circle and we’ll take the photo automatically'
    : `Place ${subject} side of your EID in the frame and we’ll take the photo automatically`;

  return (
    <>
      <div className={`capture-frame${selfie ? ' capture-frame--selfie' : ''}${captured ? ' capture-frame--captured' : ''}`}>
        {captured ? (
          <>
            {selfie
              ? <img className="capture-frame__selfie" src={sampleSelfie} alt="Sample selfie" />
              : <img
                  className={`capture-frame__document capture-frame__document--${subject}`}
                  src={sampleId}
                  alt={subject === 'front' ? 'Front of a sample ID' : 'Back of a sample ID'}
                />}
            <img className="capture-frame__check" src={captureCheck} alt="Captured" />
          </>
        ) : (
          <>
            {!selfie && <div className="capture-frame__corners" aria-hidden="true"><span /><span /><span /><span /></div>}
            <div className="capture-frame__scan-line" />
            <span className="flow-visually-hidden" role="status">
              {selfie ? 'Capturing the selfie' : `Scanning the ${subject} of the ID`}
            </span>
          </>
        )}
      </div>
      <p className="capture-description">{description}</p>
    </>
  );
}
