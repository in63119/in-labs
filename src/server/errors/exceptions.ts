import "server-only";
import AppError, { AppErrorOptions } from "./AppError";

const define = <TPayload = unknown>(options: AppErrorOptions<TPayload>) =>
  options;

export const exceptions = {
  System: {
    ADMIN_AUTH_CODE_HASH_NOT_FOUND: define({
      code: "ADMIN_AUTH_CODE_HASH_NOT_FOUND",
      message: "시스템 초기화에 실패하였습니다.",
      status: 500,
    }),
    INTERNAL_SERVER_ERROR: define({
      code: "INTERNAL_SERVER_ERROR",
      message: "알 수 없는 오류가 발생했습니다.",
      status: 500,
    }),
  },
  Blockchain: {
    FAILED_TX: define({
      code: "FAILED_TX",
      message: "블록체인 트랜잭션이 실패하였습니다.",
      status: 500,
    }),
    CONTRACT_NOT_FOUND: define({
      code: "CONTRACT_NOT_FOUND",
      message: "컨트랙트를 찾을 수 없습니다.",
      status: 404,
    }),
    NO_AVAILABLE_RELAYER: define({
      code: "NO_AVAILABLE_RELAYER",
      message: "사용 가능한 릴레이어가 없습니다.",
      status: 500,
    }),
  },
  User: {
    USER_NOT_FOUND: define({
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
      status: 404,
    }),
  },
  Auth: {
    INVALID_AUTH_CODE: define({
      code: "INVALID_AUTH_CODE",
      message: "유효하지 않은 관리자 코드입니다.",
      status: 400,
    }),
    INVALID_ORIGIN: define({
      code: "INVALID_ORIGIN",
      message: "유효하지 않은 출처입니다.",
      status: 400,
    }),
    MISSING_EMAIL: define({
      code: "MISSING_EMAIL",
      message: "email 값이 필요합니다.",
      status: 400,
    }),
    MISSING_CHALLENGE_TOKEN: define({
      code: "MISSING_CHALLENGE_TOKEN",
      message: "챌린지 토큰이 필요합니다.",
      status: 400,
    }),
    INVALID_CHALLENGE_TOKEN: define({
      code: "INVALID_CHALLENGE_TOKEN",
      message: "유효하지 않은 챌린지 토큰입니다.",
      status: 400,
    }),
    NO_PASSKEY: define({
      code: "NO_PASSKEY",
      message: "등록된 패스키가 없습니다.",
      status: 404,
    }),
    FAILED_VERIFY_CREDENTIAL: define({
      code: "FAILED_VERIFY_CREDENTIAL",
      message: "자격 증명 검증에 실패했습니다.",
      status: 400,
    }),
    FAILED_REGISTER_PASSKEY: define({
      code: "FAILED_REGISTER_PASSKEY",
      message: "패스키 등록에 실패했습니다.",
      status: 500,
    }),
  },
  Post: {
    FAILED_PUBLISH_POST: define({
      code: "FAILED_PUBLISH_POST",
      message: "포스트 게시에 실패했습니다.",
      status: 500,
    }),
    INVALID_POST_ID: define({
      code: "INVALID_POST_ID",
      message: "유효하지 않은 포스트 아이디입니다.",
      status: 400,
    }),
    INVALID_METADATA_URL: define({
      code: "INVALID_METADATA_URL",
      message: "유효하지 않은 포스트 메타데이터 URL입니다.",
      status: 400,
    }),
    INVALID_REQUEST: define({
      code: "INVALID_REQUEST",
      message: "잘못된 요청입니다.",
      status: 400,
    }),
  },
  Media: {
    NO_IMAGE_FILE: define({
      code: "NO_IMAGE_FILE",
      message: "이미지 파일이 필요합니다.",
      status: 400,
    }),
  },
  Visitor: {
    INVALID_IP: define({
      code: "INVALID_IP",
      message: "유효하지 않은 IP입니다.",
      status: 400,
    }),
    FAILED_TO_CHECK_VISIT: define({
      code: "FAILED_TO_CHECK_VISIT",
      message: "방문자 체크에 실패하였습니다.",
      status: 500,
    }),
    FAILED_TO_GET_DAY_ID: define({
      code: "FAILED_TO_GET_DAY_ID",
      message: "Day ID를 찾을 수 없습니다.",
      status: 500,
    }),
    FAILED_TO_ADD_VISIT: define({
      code: "FAILED_TO_ADD_VISIT",
      message: "방문자 추가에 실패하였습니다.",
      status: 500,
    }),
    FAILED_TO_GET_VISIT_COUNT: define({
      code: "FAILED_TO_GET_VISIT_COUNT",
      message: "방문자 수를 찾을 수 없습니다.",
      status: 500,
    }),
  },
  YouTube: {
    INVALID_REQUEST: define({
      code: "INVALID_REQUEST",
      message: "잘못된요청입니다.",
      status: 400,
    }),
    FAILED_SAVE_VIDEO: define({
      code: "FAILED_SAVE_VIDEO",
      message: "유튜브 영상 저장에 실패하였습니다.",
      status: 500,
    }),
    FAILED_LOAD_VIDEO: define({
      code: "FAILED_LOAD_VIDEO",
      message: "유튜브 영상 로드에 실패하였습니다.",
      status: 500,
    }),
    FAILED_DELETE_VIDEO: define({
      code: "FAILED_DELETE_VIDEO",
      message: "유튜브 영상 삭제에 실패하였습니다.",
      status: 500,
    }),
  },
  Email: {
    FAILED_TO_CLAIM_PIN_CODE: define({
      code: "FAILED_TO_CLAIM_PIN_CODE",
      message: "이메일 인증 중 오류가 발생했습니다.",
      status: 500,
    }),
    MISSING_REFRESH_TOKEN: define({
      code: "MISSING_REFRESH_TOKEN",
      message: "Gmail refresh token이 설정되지 않았습니다.",
      status: 500,
    }),
    FAILED_SENDING_EMAIL: define({
      code: "FAILED_SENDING_EMAIL",
      message: "이메일 전송에 실패했습니다.",
      status: 500,
    }),
    FAILED_TO_VERIFY_PIN_CODE: define({
      code: "FAILED_TO_VERIFY_PIN_CODE",
      message: "이메일 인증 코드 검증에 실패했습니다.",
      status: 500,
    }),
  },
  Subscriber: {
    MISSING_EMAIL: define({
      code: "MISSING_EMAIL",
      message: "email 값이 필요합니다.",
      status: 400,
    }),
    FAILED_TO_SUBSCRIBE: define({
      code: "FAILED_TO_SUBSCRIBE",
      message: "구독에 실패했습니다.",
      status: 500,
    }),
    ALREADY_EXISTS_SUBSCRIBER: define({
      code: "ALREADY_EXISTS_SUBSCRIBER",
      message: "이미 구독한 이메일입니다.",
      status: 400,
    }),
  },
} satisfies Record<string, Record<string, AppErrorOptions>>;

type ExceptionCatalog = typeof exceptions;

export const createAppError = <TPayload = unknown>(
  options: AppErrorOptions<TPayload>
) => new AppError(options);

export const fromException = <
  TNamespace extends keyof ExceptionCatalog,
  TKey extends keyof ExceptionCatalog[TNamespace] & string
>(
  namespace: TNamespace,
  key: TKey
) => {
  const definition = exceptions[namespace][key] as AppErrorOptions;
  return new AppError({ ...definition });
};
