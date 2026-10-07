from lighting_watch import watch
import lighting_watch as lw, tempfile, pathlib
def run(pings, label):  # 5 s polls on a simulated clock
    t=[0.0]; posts=[]; seq=iter(pings)
    def ping(h): return next(seq)
    def sleep(s): t[0]+=s
    watch('jaderna', ping=ping, post=lambda u: (posts.append(t[0]) or {'ok':True,'outcome':'sent'}), clock=lambda: t[0], sleep=sleep,
          state_file=pathlib.Path(tempfile.gettempdir())/'lw_test.json', max_loops=len(pings)-1)
    print(label, 'inits at', posts)
N=120  # 120 polls * 5 s = 600 s
run([True]*N, 'already up at start (expect none):')
run([False]*20 + [True]*N, 'appears after 100 s (expect ~220, ~400):')
run([True]*30 + [False]*5 + [True]*N, 'restarts mid-day (expect ~295, ~475):')
run([False]*10 + [True]*30 + [False]*2 + [True]*N, 'brief 10 s blip is not a restart (expect ~170, ~350):')
