import { format, subDays } from "date-fns";

const Logo = ({
  className,
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) => {
  const today = new Date();
  const pages = createPages(today);

  return (
    <div className={`position-relative ${className}`}>
      <CalPage day={today} className="shadow" />
      {animate && pages?.map((p, idx) => <CalPage key={idx} {...p} />)}
    </div>
  );
};

export default Logo;

const CalPage = ({
  day,
  ani,
  delay,
  className,
}: {
  day: Date;
  ani?: string;
  delay?: string;
  className?: string;
}) => {
  return (
    <div
      style={{ animationName: ani, animationDelay: delay }}
      className={`logo ${className}`}
    >
      <div className="logo-header">{format(day, "MMM")}</div>
      <div className="logo-content">{format(day, "dd")}</div>
    </div>
  );
};

const createPages = (today: Date) => {
  const yesterday = subDays(today, 1);

  return [
    ...Array(8)
      .fill(0)
      .map((_, idx) => ({
        className: "logo-page",
        day: subDays(yesterday, idx),
        delay: `${5000 - idx * 600}ms`,
        ani: idx % 2 === 0 ? "tearOff" : "tearOff2",
      })),
  ];
};
