export { createNotify } from "./creator/createNotify";
export { intervalOnDocumentShow } from "./creator/intervalOnDocumentShow";
export { subscribeWhenDocumentShow } from "./creator/subscribeWhenDocumentShow";

export {
  createDomainRelated,
  DomainRelatedType,
} from "./steams/createDomainHealthCheck";

export {
  documentHiden$,
  documentShow$,
  visibilitychange$,
} from "./steams/documentVisible$";
