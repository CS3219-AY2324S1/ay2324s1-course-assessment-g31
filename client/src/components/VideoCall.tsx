import { Switch } from "@headlessui/react";
import { MicrophoneIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import classNames from "../util/ClassNames";

function VideoCall() {
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableMic, setEnableMic] = useState(true);

  return (
    <div>
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 border">
        <img
          src="https://picsum.photos/1000"
          alt="Randomly Generated Person"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <Switch.Group
        as="div"
        className="flex p-4 justify-around border rounded-lg shadow"
      >
        <div className="flex items-center gap-4">
          <VideoCameraIcon
            className="h-8 w-8 text-gray-400"
            aria-hidden="true"
          />
          <Switch
            checked={enableVideo}
            onChange={setEnableVideo}
            className={classNames(
              enableVideo ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                enableVideo ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              )}
            />
          </Switch>
        </div>
        <div className="flex items-center gap-4">
          <MicrophoneIcon
            className="h-8 w-8 text-gray-400"
            aria-hidden="true"
          />
          <Switch
            checked={enableMic}
            onChange={setEnableMic}
            className={classNames(
              enableMic ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                enableMic ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              )}
            />
          </Switch>
        </div>
      </Switch.Group>
    </div>
  );
}

export default VideoCall;
