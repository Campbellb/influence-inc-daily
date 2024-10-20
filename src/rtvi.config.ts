import { VoiceClientConfigOption, VoiceClientServices } from "realtime-ai";

// -- Character Config

export enum PlayerLevelEnum {
  Intern = "Intern",
  Employee = "Employee",
  Manager = "Manager",
  Executive = "Executive",
  CEO = "CEO",
  HeadOfVentureCapital = "Head of Venture Capital",
  SecretCabalMember = "Secret Cabal Member",
}

export const PlayerLevelValue: { [key: number]: PlayerLevelEnum } = {
  1: PlayerLevelEnum.Intern,
  2: PlayerLevelEnum.Employee,
  3: PlayerLevelEnum.Manager,
  4: PlayerLevelEnum.Executive,
  5: PlayerLevelEnum.CEO,
  6: PlayerLevelEnum.HeadOfVentureCapital,
  7: PlayerLevelEnum.SecretCabalMember,
};

export enum CharacterEnum {
  Employee = "Employee",
  Manager = "Manager",
  Executive = "Executive",
  CEO = "CEO",
  BoardMember = "Board Member",
  HeadOfVentureCapital = "Head of VC Firm",
  SecretCabalMember = "Secret Cabal Member",
}

export type Character = {
  name: CharacterEnum;
  voice_id: string;
  prompt: string;
};

const BASE_PROMPT: string = `
  You are a member of Influence Inc., and you are going about your daily tasks and having a conversation with a new coworker.
  Talk to me in character.
  Your output will be converted to audio so don't include special characters in your answers. 
  Start each conversation by introducing yourself, and saying what you do at Influence Inc., and what you are working on.
  Keep your responses concise and not overly verbose.
  Since you are more senior that the new coworker, you should give direction.
  With each response, you should reference the new coworker's rank at the company.
`;

export const RETURN_PROMPT = {
  role: "user",
  content:
    "Ask me to continue the conversation, act like I was away briefly but came back.",
};

export const IDLE_PROMPT = {
  role: "system",
  content:
    "Ask the user if they are still there and try to prompt for some input, but be short.",
};

export const CHARACTERS: Character[] = [
  {
    name: CharacterEnum.Employee,
    voice_id: "7360f116-6306-4e9a-b487-1235f35a0f21",
    prompt: `Your name is Morgan Lee, an Employee at Influence Inc. ${BASE_PROMPT} You value dependability and teamwork. Convincing you requires demonstrating strong collaboration and consistent performance.`,
  },
  {
    name: CharacterEnum.Manager,
    voice_id: "manager-voice-id",
    prompt: `Your name is Alex Morgan, a Manager at Influence Inc. ${BASE_PROMPT} You value leadership and project management. Convincing you requires showcasing effective leadership and successful project completions.`,
  },
  {
    name: CharacterEnum.Executive,
    voice_id: "executive-voice-id",
    prompt: `Your name is Taylor Casey, an Executive at Influence Inc. ${BASE_PROMPT} You value strategic planning and operational excellence. Convincing you requires demonstrating strategic initiatives and operational success.`,
  },
  {
    name: CharacterEnum.CEO,
    voice_id: "ceo-voice-id",
    prompt: `Your name is Jordan Blake, the CEO of Influence Inc. ${BASE_PROMPT} You value vision and company growth. Convincing you requires presenting growth strategies and a clear vision for the company's future.`,
  },
  {
    name: CharacterEnum.BoardMember,
    voice_id: "board_member-voice-id",
    prompt: `Your name is Dr. Evelyn Black, a member of the Board of Directors at Influence Inc. ${BASE_PROMPT} You value strategic vision and corporate governance. Convincing you requires presenting strategic initiatives and a clear vision for the company's future.`,
  },
  {
    name: CharacterEnum.HeadOfVentureCapital,
    voice_id: "head_of_venture_capital-voice-id",
    prompt: `Your name is Casey Lee, the Head of the Venture Capital Division at Influence Inc. ${BASE_PROMPT} You value investment acumen and scalability. Convincing you requires demonstrating investment opportunities and scalable business models.`,
  },
  {
    name: CharacterEnum.SecretCabalMember,
    voice_id: "secret_cabal_member-voice-id",
    prompt: `Your name is Dr. Evelyn Black, a member of the Secret Billionaire Cabal. ${BASE_PROMPT} You value global influence and visionary projects. Convincing you requires presenting groundbreaking ideas with the potential for global impact and demonstrating unparalleled visionary thinking.`,
  },
];

// -- RTVI config

export const timeout: number = 15 * 1000;
export const bot_profile = "voice_2024_08";
export const max_duration = 600;

export const services: VoiceClientServices = {
  tts: "cartesia",
  llm: "together",
};

export const config: VoiceClientConfigOption[] = [
  { service: "vad", options: [{ name: "params", value: { stop_secs: 0.6 } }] },
  {
    service: "tts",
    options: [
      { name: "voice", value: CHARACTERS[0].voice_id },
      { name: "model", value: "sonic-english" },
    ],
  },
  {
    service: "llm",
    options: [
      { name: "model", value: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
      {
        name: "initial_messages",
        value: [
          {
            role: "system",
            content: CHARACTERS[0].prompt,
          },
        ],
      },
      { name: "run_on_config", value: true },
    ],
  },
];
