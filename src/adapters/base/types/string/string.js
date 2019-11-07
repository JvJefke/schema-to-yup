import { BaseType } from "../base";

export class StringType extends BaseType {
  constructor(obj) {
    super(obj);
    this.type = "string";
  }

  static create(obj, config) {
    return new StringType(obj, config);
  }

  convert() {
    super.convert();

    this.normalize();
    this.minLength();
    this.maxLength();
    this.pattern();
    this.lowercase();
    this.uppercase();
    this.email();
    this.url();
    this.genericFormat();
    return this;
  }

  get constraintNames() {
    return ["trim", "lowercase", "uppercase"];
  }

  genericFormat() {
    if (!this.config.format === true) return;
    const format = this.format;
    if (this.yup.prototype[format]) {
      this.addConstraint(this.format);
    }
  }

  email() {
    this.isEmail && this.addConstraint("email", { constraintValue: true });
    return this;
  }

  get isEmail() {
    return this.constraints.email || this.format === "email";
  }

  url() {
    this.isUrl && this.addConstraint("url", { constraintValue: true });
    return this;
  }

  get isUrl() {
    return this.constraints.url || this.format === "url";
  }

  // todo: use NumericConstraint or RangeConstraint
  minLength() {
    const { minLength } = this.constraints;
    const errMsg = this.valErrMessage("minLength") || this.valErrMessage("min");
    const newBase = minLength && this.base.min(minLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }

  // todo: use NumericConstraint or RangeConstraint
  maxLength() {
    const { maxLength } = this.constraints;
    const errMsg = this.valErrMessage("maxLength") || this.valErrMessage("max");
    const newBase = maxLength && this.base.max(maxLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }

  pattern() {
    const { pattern } = this.constraints;
    if (!pattern) {
      return this;
    }
    const regex = new RegExp(pattern);
    const errMsg = this.errorMessageOneOf("pattern", "matches", "regex");
    const newBase = regex && this.base.matches(regex, errMsg);
    this.base = newBase || this.base;
    return this;
  }

  normalize() {
    this.constraints.pattern =
      this.constraints.pattern ||
      this.constraints.matches ||
      this.constraints.regex;
    this.constraints.maxLength =
      this.constraints.maxLength || this.constraints.max;
    this.constraints.minLength =
      this.constraints.minLength || this.constraints.min;
  }
}