export interface ClippingsCallback {
  (clippings: string[]) : void;
}

class ClippingsRepository {
  public clippingsListeners: ClippingsCallback[] = [];
  protected clippings: string[] = [];

  public addClipping = (content: string) => {
    // TODO: @raphi only compare to last element here
    if (this.clippings.includes(content)) {
      return;
    }

    this.clippings.push(content);
    this.notifyListeners();
  }

  notifyListeners = () => {
    this.clippingsListeners.forEach((listener) => {
      listener(this.clippings);
    });
  }
}

export default ClippingsRepository;
