﻿/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { fileContainer } from "../scripts/fileContainer.js";
import { idle } from "../scripts/idleBehaviour.js";
import { PlayPauseToggle } from "../scripts/PlayPauseToggle.js";
import { SoundBehaviour } from "../scripts/SoundBehaviour.js";
import { SoundManager } from "../scripts/SoundManager.js";

// Register types
TypeStore.add("fileContainer", fileContainer);
TypeStore.add("idle", idle);
TypeStore.add("PlayPauseToggle", PlayPauseToggle);
TypeStore.add("SoundBehaviour", SoundBehaviour);
TypeStore.add("SoundManager", SoundManager);
